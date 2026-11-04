import test from "node:test";
import assert from "node:assert/strict";
import { normalizeAngle, relativeBearing, directionLabel, filterPlaces, visibleOnCompass } from "../web/logic.js";
import { places } from "../web/places.js";

test("wraps negative and overflow angles",()=>{assert.equal(normalizeAngle(-30),330);assert.equal(normalizeAngle(390),30)});
test("directions agree with rotation",()=>{assert.equal(relativeBearing(90,90),0);assert.equal(relativeBearing(90,0),90);assert.equal(relativeBearing(0,90),-90)});
test("direction labels are intuitive",()=>{assert.equal(directionLabel(10),"De frente");assert.equal(directionLabel(-40),"A la izquierda");assert.equal(directionLabel(70),"A la derecha")});
test("city limits catalog",()=>{assert.ok(filterPlaces(places,{city:"Córdoba"}).every(p=>p.city==="Córdoba"))});
test("search finds places by name",()=>{assert.equal(filterPlaces(places,{city:"Veracruz",search:"Terraza"}).length,1)});
test("rating filters to 6-star scale",()=>{assert.ok(filterPlaces(places,{city:"Córdoba",minimumRating:5}).every(p=>p.rating>=5))});
test("compass shows only places in forward field of view",()=>{assert.ok(visibleOnCompass(places,90,90).every(p=>Math.abs(relativeBearing(p.bearing,90))<=45))});

import { hasCoordinates, directionsUrl, distanceMeters } from '../web/maps.js';
test('demo places never receive real routes', () => {
  for (const place of places) assert.equal(directionsUrl(place), null);
  assert.equal(hasCoordinates({lat:19,lng:-96}),false);
  assert.equal(hasCoordinates({lat:91,lng:0,locationVerified:true}),false);
});
test('verified coordinates produce an encoded Google Maps route', () => {
  const url=new URL(directionsUrl({lat:19.1,lng:-96.1,locationVerified:true}));
  assert.equal(url.origin,'https://www.google.com');
  assert.equal(url.searchParams.get('api'),'1');
  assert.equal(url.searchParams.get('destination'),'19.1,-96.1');
});
test('GPS distance handles identical points, equator and date line', () => {
  assert.equal(distanceMeters({lat:0,lng:0},{lat:0,lng:0}),0);
  assert.ok(Math.abs(distanceMeters({lat:0,lng:0},{lat:0,lng:1})-111195)<=1);
  assert.ok(Math.abs(distanceMeters({lat:0,lng:179},{lat:0,lng:-179})-222390)<=1);
});
