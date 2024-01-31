   
    mapboxgl.accessToken = 'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';

    const map = new mapboxgl.Map({
            container: 'map', // container ID
            style: 'mapbox://styles/mapbox/light-v10', // style URL
            zoom: 3, // starting zoom
            center: [-100, 40] // starting center
        }
    );
    
    let response;
    let stateData;
    async function geojsonFetch() { 
        response = await fetch('assets/state_data.geojson');
        stateData = await response.json();
    }

    geojsonFetch(); 

    map.on('load', function loadingData() {
        map.addSource('stateData', {
        type: 'geojson',
        data: stateData
        });

        map.addLayer({
            'id': 'stateData-layer',
            'type': 'fill',
            'source': 'stateData',
            'paint': {
                'fill-color': [
                    'step',
                    ['get', 'density'],
                    '#FFEDA0',   // stop_output_0
                    10,          // stop_input_0
                    '#FED976',   // stop_output_1
                    20,          // stop_input_1
                    '#FEB24C',   // stop_output_2
                    50,          // stop_input_2
                    '#FD8D3C',   // stop_output_3
                    100,         // stop_input_3
                    '#FC4E2A',   // stop_output_4
                    200,         // stop_input_4
                    '#E31A1C',   // stop_output_5
                    500,         // stop_input_5
                    '#BD0026',   // stop_output_6
                    1000,        // stop_input_6
                    "#800026"    // stop_output_7
                ],
                'fill-outline-color': '#BBBBBB',
                'fill-opacity': 0.7,
            }
        });
    });

    const layers = [
    '0-9',
    '10-19',
    '20-49',
    '50-99',
    '100-199',
    '200-499',
    '500-999',
    '1000 and more'
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
    legend.innerHTML = "<b>Population Density<br>(people/sq.mi.)</b><br><br>";

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

    map.on('mousemove', ({point}) => {
    const state = map.queryRenderedFeatures(point, {
        layers: ['stateData-layer']
    });
    document.getElementById('text-description').innerHTML = state.length ?
        `<h3>${state[0].properties.name}</h3><p><strong><em>${state[0].properties.density}</strong> people per square mile</em></p>` :
        `<p>Hover over a state!</p>`;
    });

    map.on('click', (e) => {
        const state = map.queryRenderedFeatures(e.point, {
            layers: ['stateData-layer']
        });

        if (state.length > 0) {
            new mapboxgl.Popup()
                .setLngLat(e.lngLat)
                .setHTML(`<h3>${state[0].properties.name}</h3><p><strong><em>${state[0].properties.density}</strong> people per square mile</em></p>` )
                .addTo(map);
        }

        console.log(county[0])
        console.log(county[0].properties.casePer10k)
    });