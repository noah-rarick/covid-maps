
mapboxgl.accessToken = 'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v10', // style URL
    zoom: 6, // starting zoom
    center: [-120.7401, 47.7511] // starting center
}
);

let response;
let covidData;
async function geojsonFetch() {
    response = await fetch('assets/wa-covid-data-102521.geojson');
    covidData = await response.json();
}

geojsonFetch();

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
                ['get', 'casePer10k'],
                '#F0F8FF', // Lavender
                100, // stop_input_0
                '#E6E6FA', // LavenderBlush
                250, // stop_input_1
                '#D8BFD8', // Thistle
                500, // stop_input_2
                '#DDA0DD', // Plum
                750, // stop_input_3
                '#8A2BE2', // BlueViolet
                1000, // stop_input_4
                '#4B0082', // Indigo
                1250, // stop_input_5
                '#483D8B', // DarkSlateBlue
                1500, // stop_input_6
                "#000080" // Navy
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

    if (county.length > 0) {
        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(`<h3>${county[0].properties.name}</h3><p><strong><em>${county[0].properties.casePer10k}</strong> cases in the county per 10,000 residents.</em></p>`)
            .addTo(map);
    }

    console.log(county[0])
    console.log(county[0].properties.casePer10k)
});


const layers = [
    '0-99 ',
    '100-249',
    '250-499',
    '500-749',
    '750-999',
    '1000-1249',
    '1250-1499',
    '1500 and more'
];
const colors = [
    '#F0F8FF',
    '#E6E6FA',
    '#D8BFD8',
    '#DDA0DD',
    '#8A2BE2',
    '#4B0082',
    '#483D8B',
    '#000080'
];

const legend = document.getElementById('legend');
legend.innerHTML = "<b>Covid cases per 10 thousand people<br></b><br><br>";

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
        `<h3>${county[0].properties.name}</h3><p><strong><em>${county[0].properties.casePer10k}</strong> cases in the county per 10,000 residents.</em></p>` :
        `<p>Hover over a county!</p>`;
    console.log(county[0])
    console.log(county[0].properties.casePer10k)
});
