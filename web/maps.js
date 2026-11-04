export function hasCoordinates(place) {
  return Number.isFinite(place.lat) && Math.abs(place.lat) <= 90 && Number.isFinite(place.lng) && Math.abs(place.lng) <= 180 && place.locationVerified === true;
}
export function directionsUrl(place) {
  if (!hasCoordinates(place)) return null;
  const url = new URL("https://www.google.com/maps/dir/");
  url.search = new URLSearchParams({api: "1", destination: `${place.lat},${place.lng}`}).toString();
  return url.href;
}
export function distanceMeters(a, b) {
  const rad = n => n * Math.PI / 180;
  const h = Math.sin(rad(b.lat-a.lat)/2)**2 + Math.cos(rad(a.lat))*Math.cos(rad(b.lat))*Math.sin(rad(b.lng-a.lng)/2)**2;
  return Math.round(6371000 * 2 * Math.atan2(Math.sqrt(Math.min(1,h)), Math.sqrt(Math.max(0,1-h))));
}
const centers = {"Veracruz": {lat:19.1738,lng:-96.1342}, "Córdoba": {lat:18.8839,lng:-96.9256}};
let map, markers = [], userMarker;
export function updateMap(city, places, position) {
  if (!map) return;
  map.setCenter(centers[city]);
  markers.forEach(marker => marker.setMap(null));
  markers = places.filter(hasCoordinates).map(place => new google.maps.Marker({map, position:{lat:place.lat,lng:place.lng}, title:place.name}));
  userMarker?.setMap(null);
  if (position) userMarker = new google.maps.Marker({map,position,title:"Tu ubicación"});
}
export function loadMap(key, element) {
  return new Promise((resolve,reject) => {
    let settled = false;
    const fail = () => {if (!settled) {settled=true;clearTimeout(timer);reject(new Error("No se pudo cargar Google Maps. Revisa la clave, sus restricciones y la facturación."));}};
    const timer = setTimeout(fail,20000);
    window.gm_authFailure = fail;
    window.melMapsReady = () => {
      if (settled) return;
      try {
        map = new google.maps.Map(element,{center:centers.Veracruz,zoom:14,mapTypeControl:false,streetViewControl:false});
        settled=true;clearTimeout(timer);resolve();
      } catch {fail();}
    };
    const script=document.createElement("script");
    const params=new URLSearchParams({key,callback:"melMapsReady",loading:"async",v:"weekly",language:"es",region:"MX"});
    script.src=`https://maps.googleapis.com/maps/api/js?${params}`;
    script.async=true;script.onerror=fail;document.head.append(script);
  });
}
