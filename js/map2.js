mapboxgl.accessToken = 'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v10', // style URL
    zoom: 3, // starting zoom
    center: [-98.5795, 39.8283] // starting center
});

const colorRamp = [
    [500, '#f2e1f9'],
    [1000, '#dcbcdf'],
    [5000, '#b983c7'],
    [10000, '#9e4fb5'],
    [50000, '#7b1fa2']
];


// Load the GeoJSON data and then add it to the map
async function loadAndAddData() {
    const response = await fetch('/assets/us-covid-2020-counts.json'); // Adjust the path as needed
    const covidData = await response.json();

    map.on('load', () => {
        map.addSource('covidData', {
            type: 'geojson',
            data: covidData
        });

        map.addLayer({
            'id': 'covidData-layer',
            'type': 'circle',
            'source': 'covidData',
            'paint': {
                'circle-radius': {
                    'property': 'cases',
                    'stops': [
                        [500, 5],
                        [1000, 10],
                        [5000, 15],
                        [10000, 20],
                        [50000, 25]
                    ]
                },
                'circle-color': {
                    'property': 'cases',
                    'stops': colorRamp
                },
                'circle-stroke-color': 'white',
                'circle-stroke-width': 1,
                'circle-opacity': 0.75
            }
        });

        updateLegend();

        // Setup event listeners for mousemove and click events
        map.on('mousemove', 'covidData-layer', (e) => {
            if (e.features.length > 0) {
                const properties = e.features[0].properties;
                // Example: Update some HTML element with the county name
                document.getElementById('text-description').innerHTML = `<b> ${properties.county} County </b> of <b>${properties.state} state has: <br> ${properties.cases} cases`;
            }
        });

        map.on('click', 'covidData-layer', (e) => {
            if (e.features.length > 0) {
                const properties = e.features[0].properties;
                new mapboxgl.Popup()
                    .setLngLat(e.lngLat)
                    .setHTML(`<strong>County:</strong> ${properties.county}<br><strong>State:</strong> ${properties.state}<br><strong>Cases:</strong> ${properties.cases}`)
                    .addTo(map);
            }
        });
    });
}
function updateLegend() {
    const legend = document.getElementById('legend');
    legend.innerHTML = '<strong>Case Counts</strong><br>'; // Reset legend content
    
    colorRamp.forEach(([cases, color]) => {
        const item = document.createElement('div');
        const key = document.createElement('span');
        key.className = 'legend-key';
        key.style.backgroundColor = color;

        const value = document.createElement('span');
        value.innerHTML = ` ${cases}+ cases`;
        item.appendChild(key);
        item.appendChild(value);
        legend.appendChild(item);
    });
}


loadAndAddData();