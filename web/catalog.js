import {hasCoordinates, directionsUrl, distanceMeters} from "./maps.js";
export const normalizePlace = p => ({...p,lat:p.coordinates?.lat,lng:p.coordinates?.lng,locationVerified:p.verifiedCoordinates === true});
const fold = s => String(s).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLocaleLowerCase("es-MX");
export function selectCatalog(places,{city="Veracruz",category="all",search="",nearby=false,position=null}={}) {
  const query=fold(search.trim());
  const result=places.filter(p=>p.city===city && (category==="all"||p.category===category) && (!query||fold(`${p.name} ${p.description} ${p.category}`).includes(query))).map(p=>({...p,distance:position&&hasCoordinates(p)?distanceMeters(position,p):null}));
  return nearby?result.filter(p=>p.distance!==null).sort((a,b)=>a.distance-b.distance):result;
}
const html = value => String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);
const external = (url,label) => `<a href="${html(url)}" target="_blank" rel="noopener noreferrer">${label} ↗</a>`;
export function mountCatalog(host,onChange) {
  let places=[],position=null;
  const state={city:"Veracruz",category:"all",search:"",nearby:false};
  host.innerHTML=`<header class="hero"><span class="eyebrow">BLACKMAMBA CORP · MEL CLUB</span><h1>MEL <span>EXPLORER</span></h1><p>Encuentra tu próximo lugar en Veracruz.</p></header><section class="results real-catalog"><h2>📍 Lugares reales</h2><p>49 fichas de investigación con fuentes institucionales. Confirma horarios y acceso antes de salir. Sin reseñas MEL ni promociones confirmadas.</p><label>Ciudad del catálogo<select id="real-city"><option>Veracruz</option><option>Córdoba</option></select></label><label>Buscar lugares reales<input id="real-search" placeholder="Museo, malecón, café…"></label><label>Categoría del catálogo<select id="real-category"><option value="all">Todas</option></select></label><label><input id="real-nearby" type="checkbox"> Ordenar cerca de mí (requiere GPS; solo ubicaciones verificadas)</label><p id="real-status" role="status">Cargando catálogo…</p><div id="real-results" class="cards"></div><button id="real-retry" hidden>Reintentar carga</button></section>`;
  const status=host.querySelector("#real-status"), results=host.querySelector("#real-results");
  function render(){
    const selected=selectCatalog(places,{...state,position});
    status.textContent=state.nearby&&!position?"Activa «Usar mi ubicación» para ordenar por distancia.":`${selected.length} lugares · ${selected.filter(hasCoordinates).length} con ubicación verificada`;
    results.innerHTML=state.nearby&&!position?"":selected.length?selected.map(p=>{
      const route=directionsUrl(p);
      const search="https://www.google.com/maps/search/?"+new URLSearchParams({api:"1",query:`${p.name}, ${p.city}, Veracruz, México`});
      return `<article class="place real-place"><div class="place-main"><h3>${html(p.name)}</h3><p>${html(p.description)}</p><span class="verification">${hasCoordinates(p)?"Ubicación documentada en fuente":"Ubicación precisa pendiente"}</span><p>${p.distance!==null?`${p.distance} m en línea recta`:"Distancia sin calcular"} · Sin reseñas MEL</p><details><summary>Ver ficha</summary><dl><dt>Dirección</dt><dd>${html(p.address||"Por verificar")}</dd><dt>Horario publicado</dt><dd>${html(p.hours||"Por verificar")}</dd><dt>Contacto</dt><dd>${p.phone?`<a href="tel:${html(p.phone)}">${html(p.phone)}</a>`:"Por verificar"}</dd><dt>Revisión de datos</dt><dd>${html(p.detailsCheckedOn||"Pendiente de revisión actual")}</dd></dl><p>Sin convenio comercial ni descuento confirmado. Fotos pendientes de autorización.</p>${external(p.sourceUrl,"Consultar fuente institucional")}</details><div class="place-links">${route?external(route,"Cómo llegar"):external(search,"Buscar en Google Maps")}<small>${route?"Confirma el acceso al llegar.":"Google resolverá la búsqueda; verifica el destino."}</small></div></div></article>`;
    }).join(""):"<p>No hay lugares para estos filtros. El catálogo de Córdoba está pendiente.</p>";
    onChange(state.city,selected);
  }
  host.querySelector("#real-city").onchange=e=>{state.city=e.target.value;render()};
  host.querySelector("#real-search").oninput=e=>{state.search=e.target.value;render()};
  host.querySelector("#real-category").onchange=e=>{state.category=e.target.value;render()};
  host.querySelector("#real-nearby").onchange=e=>{state.nearby=e.target.checked;render()};
  async function load(){
    const retry=host.querySelector("#real-retry");retry.hidden=true;status.textContent="Cargando catálogo…";
    try{
      const response=await fetch("./data/veracruz-places.json");if(!response.ok)throw Error();
      const data=await response.json();if(!Array.isArray(data.places))throw Error();
      places=data.places.map(normalizePlace);
      const categories=[...new Set(places.map(p=>p.category))];
      host.querySelector("#real-category").innerHTML='<option value="all">Todas</option>'+categories.map(c=>`<option value="${html(c)}">${html(c)}</option>`).join("");
      state.category="all";render();
    }catch{status.textContent="No se pudo cargar el catálogo. Revisa la conexión y vuelve a intentar.";retry.hidden=false;}
  }
  host.querySelector("#real-retry").onclick=load;
  load();
  return {setPosition(value){position=value;render()},refresh:render};
}
