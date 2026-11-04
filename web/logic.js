export function normalizeAngle(value) {
  return ((Number(value) % 360) + 360) % 360;
}

export function relativeBearing(targetBearing, heading) {
  return ((normalizeAngle(targetBearing) - normalizeAngle(heading) + 540) % 360) - 180;
}

export function directionLabel(relative) {
  if (Math.abs(relative) <= 15) return "De frente";
  return relative > 0 ? "A la derecha" : "A la izquierda";
}

export function filterPlaces(places, { city = "Veracruz", category = "all", search = "", minimumRating = 0 } = {}) {
  const query = search.trim().toLocaleLowerCase("es-MX");
  return places.filter(place =>
    place.city === city &&
    (category === "all" || place.category === category) &&
    place.rating >= minimumRating &&
    (!query || [place.name, place.description, place.category].some(value => value.toLocaleLowerCase("es-MX").includes(query)))
  ).sort((a,b) => a.distance - b.distance);
}

export function visibleOnCompass(places, heading, fieldOfView = 120) {
  return places.filter(place => Math.abs(relativeBearing(place.bearing, heading)) <= fieldOfView / 2);
}
