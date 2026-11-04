import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {normalizePlace,selectCatalog} from '../web/catalog.js';
import {directionsUrl,hasCoordinates} from '../web/maps.js';
const data=JSON.parse(await readFile(new URL('../web/data/veracruz-places.json',import.meta.url),'utf8'));
const places=data.places.map(normalizePlace);
test('all 49 researched places remain visible without GPS or ratings',()=>{
  assert.equal(selectCatalog(places).length,49);
  assert.equal(new Set(places.map(p=>p.id)).size,49);
  assert.ok(places.every(p=>p.rating===null&&p.discount===null));
  assert.deepEqual(selectCatalog(places,{city:'Córdoba'}),[]);
});
test('real search ignores accents and combines categories',()=>{
  assert.equal(selectCatalog(places,{search:'diaz miron'})[0].name,'Casa Museo Salvador Díaz Mirón');
  assert.ok(selectCatalog(places,{category:'museos'}).length>0);
  assert.ok(selectCatalog(places,{category:'museos'}).every(p=>p.category==='museos'));
});
test('only sourced coordinates produce routes and GPS distances',()=>{
  const located=places.filter(hasCoordinates);
  assert.equal(located.length,1);
  assert.ok(located.every(p=>p.coordinateSourceUrl&&directionsUrl(p)));
  assert.ok(places.filter(p=>!hasCoordinates(p)).every(p=>directionsUrl(p)===null));
  const nearby=selectCatalog(places,{nearby:true,position:{lat:located[0].lat,lng:located[0].lng}});
  assert.equal(nearby.length,1);assert.equal(nearby[0].distance,0);
  assert.deepEqual(selectCatalog(places,{nearby:true}),[]);
});
test('nearby ordering uses numeric GPS distances, not catalog order',()=>{
  const sample=[2,1,3].map(n=>({name:String(n),description:'',city:'Veracruz',category:'mar',lat:0,lng:n,locationVerified:true}));
  assert.deepEqual(selectCatalog(sample,{nearby:true,position:{lat:0,lng:0}}).map(p=>p.name),['1','2','3']);
});
