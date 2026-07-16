// AfriGrid Atlas - Africa's power map (MapLibre GL)
// Plants colored by energy source (hydro, solar, wind, geothermal, coal, gas).
// Sized by capacity. Optional electricity-access layer shows the urban-rural gap.

const FUEL_COLORS = [
'match', ['get', 'fuel'],
'Hydro', '#29b6f6',
'Solar', '#ffca28',
'Wind', '#66bb6a',
'Geothermal', '#ef5350',
'Coal', '#78909c',
'Gas', '#ab47bc',
'Nuclear', '#26c6da',
'#cccccc'
];

const map = new maplibregl.Map({
container: 'map',
style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
center: [21, 3],
zoom: 3.1
});

map.addControl(new maplibregl.NavigationControl(), 'bottom-right');

async function loadData(url) {
const res = await fetch(url);
if (!res.ok) throw new Error('Failed to load ' + url + ': ' + res.status);
return res.json();
}

function updateStats(features) {
const total = features.reduce((s, f) => s + (Number(f.properties.capacity_mw) || 0), 0);
document.getElementById('stat-plants').textContent = features.length;
document.getElementById('stat-capacity').textContent = total.toLocaleString();
}

async function init() {
let plants;
try {
plants = await loadData('./data/power_plants.geojson');
} catch (err) {
console.error('Could not load plants:', err);
return;
}

// --- Power plants layer (energy sources) ---
map.addSource('plants', { type: 'geojson', data: plants });
map.addLayer({
id: 'plants',
type: 'circle',
source: 'plants',
paint: {
'circle-radius': ['interpolate', ['linear'], ['to-number', ['get', 'capacity_mw']], 90, 5, 5000, 26],
'circle-color': FUEL_COLORS,
'circle-opacity': 0.9,
'circle-stroke-width': 1.5,
'circle-stroke-color': '#0d1117'
}
});
map.on('click', 'plants', (e) => {
const p = e.features[0].properties;
new maplibregl.Popup().setLngLat(e.lngLat)
.setHTML('<strong>' + p.name + '</strong><br/>' + p.country + ' &middot; ' + p.region + ' Africa<br/>Source: ' + p.fuel + '<br/>Capacity: ' + Number(p.capacity_mw).toLocaleString() + ' MW<br/>Commissioned: ' + p.year)
.addTo(map);
});
map.on('mouseenter', 'plants', () => { map.getCanvas().style.cursor = 'pointer'; });
map.on('mouseleave', 'plants', () => { map.getCanvas().style.cursor = ''; });

updateStats(plants.features);

// --- Fuel-type filters ---
function applyFuelFilter() {
const active = Array.from(document.querySelectorAll('.fuel:checked')).map(el => el.value);
map.setFilter('plants', ['match', ['get', 'fuel'], active, true, false]);
updateStats(plants.features.filter(f => active.includes(f.properties.fuel)));
}
document.querySelectorAll('.fuel').forEach(el => el.addEventListener('change', applyFuelFilter));

// --- Access (urban-rural gap) overlay: optional, isolated so it can't block plants ---
try {
const access = await loadData('./data/access.json');
const accessGeo = {
type: 'FeatureCollection',
features: access.countries.map(c => ({
type: 'Feature',
properties: { country: c.country, urban: c.urban, rural: c.rural, gap: c.gap },
geometry: { type: 'Point', coordinates: [c.lon, c.lat] }
}))
};
map.addSource('access', { type: 'geojson', data: accessGeo });
map.addLayer({
id: 'access',
type: 'circle',
source: 'access',
layout: { visibility: 'none' },
paint: {
'circle-radius': ['interpolate', ['linear'], ['to-number', ['get', 'gap']], 0, 20, 71, 70],
'circle-color': ['interpolate', ['linear'], ['to-number', ['get', 'gap']], 0, '#1b5e20', 35, '#f9a825', 71, '#b71c1c'],
'circle-opacity': 0.35,
'circle-blur': 0.3
}
}, 'plants');
map.on('click', 'access', (e) => {
const p = e.features[0].properties;
new maplibregl.Popup().setLngLat(e.lngLat)
.setHTML('<strong>' + p.country + '</strong><br/>Urban access: ' + p.urban + '%<br/>Rural access: ' + p.rural + '%<br/>Urban-rural gap: ' + p.gap + ' pp')
.addTo(map);
});
document.getElementById('toggle-access').addEventListener('change', (e) => {
map.setLayoutProperty('access', 'visibility', e.target.checked ? 'visible' : 'none');
});
} catch (err) {
console.error('Access overlay unavailable:', err);
}
}

if (map.loaded()) {
init();
} else {
map.on('load', init);
}
