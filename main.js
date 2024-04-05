let map = L.map('map').setView([40.730610, -73.935242], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


L.geoJSON(precinctBoundaries).addTo(map);


var markers = L.markerClusterGroup();
var marker = L.geoJSON(arrestData)

markers.addLayer(marker)
map.addLayer(markers)



function highlightFeature(e) {
    let layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.9
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
    info.update(layer.feature.properties);

}

function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

geojson = L.geoJson(precinctBoundaries, {
    onEachFeature: onEachFeature
}).addTo(map);


let info = L.control()

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
// should try to make this code prettier - maybe use anon function to pull in the boroStats rather than making individual function calls
info.update = function (props) {
    if (props) {
        totalArrests = precinctStats[`${props.precinct}`].precinct_total_arrests
    }
    this._div.innerHTML = '<h4>NYPD Precincts</h4>' +  (props ?
        '<b>' + `Precinct: ${props.precinct}` + '</b>' + '</br>' + `Total Arrests: ${totalArrests}` + '</br>' + totalRacialArrests(props.precinct) + totalGenderArrests(props.precinct): 'Hover over a precinct');
};

info.addTo(map);


function totalRacialArrests(precinct) {
    const racialArrestsObject = precinctStats[`${precinct}`].precinct_perp_race
    let returnString = `` 
    for (const race in racialArrestsObject){
        returnString = returnString.concat('\n', `<b>${String(race)}:</b> ${String(racialArrestsObject[race])}</br>`)
    }
    return returnString
}

function totalGenderArrests(precinct) {
    const genderArrestsObject = precinctStats[`${precinct}`].precinct_perp_sex
    let returnString = ``
    for (const gender in genderArrestsObject) {
        returnString = returnString.concat('\n', `<b>${String(gender)}:</b> ${String(genderArrestsObject[gender])}</br>`)
    }
    return returnString
}
