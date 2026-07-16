// AfriGrid Atlas - map logic (MapLibre GL)
// Renders Africa's power plants, transmission lines, substations, data centers,
// and locational electricity prices. African adaptation of InfraMap.

const PRICE_COLORS = [
'case',
['<', ['get', 'price_usd_mwh'], 50], '#2ecc71',
['<', ['get', 'price_usd_mwh'], 75], '#f1c40f',
'#e74c3c'
];

const map = new maplibregl.Map({
container: 'map',
style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
center: [20, 3],
zoom: 3
});

map.addControl(new maplibregl.NavigationControl(), 'bottom-right');

async function loadData(url) {
const res = await fetch(url);
return res.json();
}

map.on('load', async () => {
const plants = await loadData('./data/power_plants.geojson');

map.addSource('plants', { type: 'geojson', data: plants });

// Power plants sized by capacity, colored by locational price
map.addLayer({
id: 'plants',
type: 'circle',
source: 'plants',
paint: {
'circle-radius': ['interpolate', ['linear'], ['get', 'capacity_mw'], 100, 4, 5000, 22],
'circle-color': PRICE_COLORS,
'circle-opacity': 0.85,
'circle-stroke-width': 1,
'circle-stroke-color': '#111'
}
});

// Click popups with plant details
map.on('click', 'plants', (e) => {
const p = e.features[0].properties;
new maplibregl.Popup()
.setLngLat(e.lngLat)
.setHTML('<strong>' + p.name + '</strong><br/>' + p.country + '<br/>Fuel: ' + p.fuel + '<br/>Capacity: ' + p.capacity_mw + ' MW<br/>Price: $' + p.price_usd_mwh + '/MWh')
.addTo(map);
});

map.on('mouseenter', 'plants', () => { map.getCanvas().style.cursor = 'pointer'; });
map.on('mouseleave', 'plants', () => { map.getCanvas().style.cursor = ''; });

// Layer toggle wiring (lines/substations/datacenters added when data available)
const toggle = (id, layer) => {
const el = document.getElementById(id);
if (!el) return;
el.addEventListener('change', () => {
if (map.getLayer(layer)) {
map.setLayoutProperty(layer, 'visibility', el.checked ? 'visible' : 'none');
}
});
};
toggle('toggle-plants', 'plants');
toggle('toggle-lines', 'lines');
toggle('toggle-substations', 'substations');
toggle('toggle-datacenters', 'datacenters');
});
