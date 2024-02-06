
mapboxgl.accessToken = 'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v10', // style URL
    zoom: 3, // starting zoom
    center: [-98.5795, 39.8283] // starting center
}
);

let response;
let covidData;
async function geojsonFetch() {
    response = await fetch('assets/us-covid-2020-rates.json');
    covidData = await response.json();
}

geojsonFetch();

map.setProjection({
    name: 'albers',
    center: [-100, 40],
    parallels: [30, 50]
});

map.on('load', function loadingData() {
    map.addSource('covidData', {
        type: 'geojson',
        data: covidData
    });

    map.addLayer({
        'id': 'covidData-layer',
        'type': 'fill',
        'source': 'covidData',
        'paint': {
            'fill-color': [
                'step',
                ['get', 'rates'],
                '#FFEDA0',  
                20,          
                '#FED976',   
                40,          
                '#FEB24C',   
                60,          
                '#FD8D3C',  
                80,         
                '#FC4E2A',   
                100,         
                '#E31A1C',   
                120,         
                '#BD0026',   
                140,       
                "#800026"   
            ],
            'fill-outline-color': '#BBBBBB',
            'fill-opacity': 0.7,
        }
    });
});

map.on('click', (e) => {
    const county = map.queryRenderedFeatures(e.point, {
        layers: ['covidData-layer']
    });

    console.log(county);

    if (county.length > 0) {
        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(`<h3>${county[0].properties.county}</h3><p><strong><em>${county[0].properties.rates}</strong> cases in the county per 10,000 residents.</em></p>`)
            .addTo(map);
    }
});


const layers = [
    '0-19',
    '20-39',
    '40-59',
    '60-79',
    '80-99',
    '100-119',
    '120-139',
    '140 and more'
];
const colors = [
    '#FFEDA070',
    '#FED97670',
    '#FEB24C70',
    '#FD8D3C70',
    '#FC4E2A70',
    '#E31A1C70',
    '#BD002670',
    '#80002670'
];


const legend = document.getElementById('legend');
legend.innerHTML = "<b>Covid cases per thousand people<br></b><br><br>";

layers.forEach((layer, i) => {
    const color = colors[i];
    const item = document.createElement('div');
    const key = document.createElement('span');
    key.className = 'legend-key';
    key.style.backgroundColor = color;

    const value = document.createElement('span');
    value.innerHTML = `${layer}`;
    item.appendChild(key);
    item.appendChild(value);
    legend.appendChild(item);
});

map.on('mousemove', ({ point }) => {
    const county = map.queryRenderedFeatures(point, {
        layers: ['covidData-layer']
    });
    document.getElementById('text-description').innerHTML = county.length ?
        `<h3>${county[0].properties.county}</h3><p><strong><em>${county[0].properties.rates}</strong> cases in the county per 1,000 residents.</em></p>` :
        `<p>Hover over a county!</p>`;
});
