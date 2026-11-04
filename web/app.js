import { hasCoordinates, directionsUrl, distanceMeters, loadMap, updateMap } from "./maps.js";
import { places, categories } from "./places.js";
import { filterPlaces, relativeBearing, directionLabel } from "./logic.js";

const root = document.querySelector("#app");
const state = { city:"Veracruz", category:"all", search:"", rating:0, heading:85, range:800 };
const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" })[char]);
let position = null;
const catalog = () => places.map(p => position && hasCoordinates(p) ? {...p,distance:distanceMeters(position,p)} : p);
const list = () => filterPlaces(catalog(), {city:state.city,category:state.category,search:state.search,minimumRating:state.rating}).filter(p => p.distance <= state.range);
const stars = score => `⭐ ${score.toFixed(1)}/6`;

function render() {
  const data=list();
  root.innerHTML = `
    <header class="hero"><div class="header-row"><div><span class="eyebrow">BLACKMAMBA CORP · PROTOTIPO v0.1</span><h1>MEL <span>EXPLORER</span></h1><p>Descubre tu ciudad como si fuera un videojuego.</p></div><div class="brand">🐍</div></div><p class="notice">🧪 DEMO · Todos los establecimientos, reseñas, distancias y descuentos son ficticios. El GPS es opcional. El radar y las distancias de los lugares ficticios siguen siendo simulados.</p></header>
    <main>
      <section class="toolbar">
        <label>Ciudad <select id="city"><option value="Veracruz" ${state.city==="Veracruz"?"selected":""}>🌊 Veracruz Puerto</option><option value="Córdoba" ${state.city==="Córdoba"?"selected":""}>🌿 Córdoba</option></select></label>
        <label>¿Qué buscas?<input id="search" placeholder="Comida, mar, cafés, plazas..." value="${escapeHtml(state.search)}" autocomplete="off"></label>
        <div class="categories" aria-label="Categorías">${categories.map(cat=>`<button type="button" data-category="${cat.id}" class="${cat.id===state.category?"selected":""}">${cat.emoji} ${cat.label}</button>`).join("")}</div>
        <div class="filters"><label>Calificación <select id="rating">${[0,4,5,5.5].map(n=>`<option value="${n}" ${state.rating===n?"selected":""}>${n===0?"Todas":n+"+ ★"}</option>`).join("")}</select></label><label>Distancia <select id="range">${[200,500,800,1500].map(n=>`<option value="${n}" ${state.range===n?"selected":""}>${n} m</option>`).join("")}</select></label></div>
      </section>
      <section class="radar"><div class="section-title"><h2>🎮 MEL Radar</h2><strong>${state.heading}°</strong></div><p>Simula hacia dónde apuntas tu celular. Las orientaciones son ficticias.</p><div class="compass" role="img" aria-label="Brújula simulada orientada a ${state.heading} grados"><div class="axis">${["N","NE","E","SE","S","SO","O","NO"].map((v,i)=>`<span style="left:${(i*45-state.heading+720)%360/360*100}%">${v}</span>`).join("")}</div><div class="pointer">▼</div>${data.filter(p=>Math.abs(relativeBearing(p.bearing,state.heading))<=65).map(p=>`<div class="radar-tag" style="left:${50+relativeBearing(p.bearing,state.heading)/130*100/2}%">${p.emoji} <small>${p.distance}m</small></div>`).join("")}</div><label class="heading-label">Orientación <input id="heading" type="range" min="0" max="359" value="${state.heading}"></label></section>
      <section class="results"><div class="section-title"><h2>📍 Explorar lugares</h2><span>${data.length} resultado(s)</span></div><div class="cards">${data.length?data.map(p=>`<article class="place"><div class="place-emoji">${p.emoji}</div><div class="place-main"><h3>${escapeHtml(p.name)}</h3>${directionsUrl(p)?`<a target="_blank" rel="noopener noreferrer" href="${escapeHtml(directionsUrl(p))}">Cómo llegar ↗</a>`:""}<p>${escapeHtml(p.description)}</p><div class="meta"><b>${stars(p.rating)}</b><span>· ${p.distance}m ${hasCoordinates(p)&&position?"GPS":"simulados"}</span><span>· ${directionLabel(relativeBearing(p.bearing,state.heading))}</span></div></div>${p.discount>0?`<span class="offer">-${p.discount}%<small>DEMO</small></span>`:""}</article>`).join(""):'<p class="empty">No hay resultados con estos filtros en el catálogo de prueba.</p>'}</div></section>
      <footer>La calificación de 6 estrellas no se vende · MEL Family y monetización son módulos futuros, no activos · <a href="https://github.com/Blackmvmba88/Melinterfaz">GitHub</a></footer>
    </main>`;
  updateMap(state.city, data, position);
  root.querySelector("#city").addEventListener("change", e => {state.city=e.target.value;render()});
  root.querySelector("#search").addEventListener("input", e => {const cursor=e.target.selectionStart;state.search=e.target.value;render();const input=root.querySelector("#search");input.focus();input.setSelectionRange(cursor,cursor)});
  root.querySelector("#rating").addEventListener("change", e => {state.rating=Number(e.target.value);render()});
  root.querySelector("#range").addEventListener("change", e => {state.range=Number(e.target.value);render()});
  root.querySelector("#heading").addEventListener("input", e => {state.heading=Number(e.target.value);render()});
  root.querySelectorAll("[data-category]").forEach(button=>button.addEventListener("click",()=>{state.category=button.dataset.category;render()}));
}
render();

const panel=document.createElement("section");
panel.className="map-panel";
panel.innerHTML=`<h2>🗺️ Google Maps</h2><p>Explora la ciudad. Los lugares DEMO no tienen marcadores ni rutas porque son ficticios.</p><div class="map-actions"><button id="gps">Usar mi ubicación</button><button id="clear-gps" hidden>Olvidar ubicación</button><a id="city-maps" target="_blank" rel="noopener noreferrer">Explorar en Google Maps ↗</a></div><p id="gps-status" role="status">Ubicación desactivada. Solo se usa durante esta sesión; al conectar el mapa se comparte con Google para mostrar tu marcador.</p><details><summary>Conectar Google Maps</summary><p>Introduce una clave restringida de Maps JavaScript API con facturación habilitada. Se utilizará solo en esta pestaña.</p><form id="maps-config"><label>Clave de Google Maps<input id="maps-key" type="password" autocomplete="off" required></label><button>Conectar mapa</button></form></details><p id="maps-status" role="status">Puedes explorar Google Maps sin conectar una clave.</p><div id="google-map" hidden aria-label="Mapa de la ciudad"></div>`;
root.before(panel);
const gps=panel.querySelector("#gps"), gpsStatus=panel.querySelector("#gps-status"), clearGps=panel.querySelector("#clear-gps");
let gpsRequest=0;
gps.onclick=()=>{
  if (!navigator.geolocation) {gpsStatus.textContent="Este navegador no permite geolocalización.";return;}
  const request=++gpsRequest;
  gps.disabled=true;gpsStatus.textContent="Esperando permiso y señal GPS…";
  navigator.geolocation.getCurrentPosition(result=>{
    if(request!==gpsRequest)return;
    position={lat:result.coords.latitude,lng:result.coords.longitude};
    gps.disabled=false;clearGps.hidden=false;
    gpsStatus.textContent=`Ubicación obtenida · precisión aproximada: ${Math.round(result.coords.accuracy)} m. Los lugares DEMO conservan distancias simuladas.`;
    render();
  },error=>{
    if(request!==gpsRequest)return;
    gps.disabled=false;gpsStatus.textContent=({1:"Permiso de ubicación denegado. Puedes habilitarlo en el navegador.",2:"No se pudo obtener la ubicación.",3:"Se agotó el tiempo para obtener la ubicación."})[error.code]||"No se pudo obtener la ubicación.";
  },{enableHighAccuracy:true,timeout:15000,maximumAge:0});
};
clearGps.onclick=()=>{gpsRequest++;position=null;gps.disabled=false;clearGps.hidden=true;gpsStatus.textContent="Ubicación olvidada.";render();};
const cityLink=panel.querySelector("#city-maps");
function updateCityLink(){cityLink.href="https://www.google.com/maps/search/?"+new URLSearchParams({api:"1",query:state.city+", Veracruz, México"});}
root.addEventListener("change",updateCityLink);updateCityLink();
panel.querySelector("#maps-config").onsubmit=async event=>{
  event.preventDefault();
  const input=panel.querySelector("#maps-key"), button=event.submitter, status=panel.querySelector("#maps-status"), canvas=panel.querySelector("#google-map");
  const key=input.value.trim();if(!key)return;
  button.disabled=true;input.value="";status.textContent="Cargando mapa…";canvas.hidden=false;
  try {await loadMap(key,canvas);updateMap(state.city,list(),position);status.textContent="Mapa conectado. Solo se marcan lugares con coordenadas verificadas.";}
  catch(error){status.textContent=error.message;canvas.hidden=true;status.textContent+=" Recarga la página para volver a intentar.";}
};
