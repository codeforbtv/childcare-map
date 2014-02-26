/* 
 * This script is the starting point for our leaflet work.  It should be loaded
 * after leaflet, jQuery and it's required assets.
 */
 

// create map
var map = L.map('map', {
    center: new L.LatLng(44.4825904, -73.2226484),
    zoom: 13
});	

// define which tiles to use as basemap
var baseMap = L.tileLayer('https://{s}.tiles.mapbox.com/v3/landplanner.hc15p9k5/{z}/{x}/{y}.png', {
	maxZoom: 18,
	attribution: 'Mapbox, Openstreetmap Contributors'
});

// Adding the centers as a pure geojson file - add new features here:
// http://geojson.io/#id=gist:wboykinm/2f592dd705c119a22f03&map=13/44.4731/-73.2309
// . . . then copy new JSON back into this file before re-launching page
var testCentersLayer = L.layerGroup();
$.getJSON("assets/childcare-centers.geojson", function(data) {
  var geojson = L.geoJson(data, {
	 onEachFeature: function (feature, layer) {
		// Add a custom icon fot the chilcare centers
		layer.setIcon(L.icon({
			 "iconUrl": "images/baby.png",
			 "iconSize": [36, 36],		// size of the icon
			 "iconAnchor": [18, 18],	// point of the icon which will correspond to marker's location
			 "popupAnchor": [0, -18],	// point from which the popup should open relative to the iconAnchor
			 "className": "dot"
		}));
		layer.bindPopup("<h3>" + feature.properties.name + "</h3><table class='table table-striped table-condensed'><tr><td>Quality</td><td>" + feature.properties.quality + "</td></tr><tr><td>Capacity</td><td>" + feature.properties.Capacity05 + "</td></tr><tr><td>Center Location</td><td>" + feature.properties.CenterLocation + "</td></tr></table>");
	 }
  });
  //geojson.addTo(map);
	testCentersLayer.addLayer( geojson );
});


// Add city of Burlington boundary
var myStyle = {
	"color": "green",
	"weight": 5,
	"opacity": 0.65
};
var cityBounds = L.geoJson(political_borders, { style: myStyle });

// add layers to the map
map.addLayer( baseMap );
//map.addLayer( cityBounds );  // load without city boundary
map.addLayer( testCentersLayer );

// a layer control
// NOTE: we may want to replace this with a different control that makes it faster for users to toggle things on/off
var overlayLayers = { 
	"Show City Boundaries": cityBounds,
	"Show Daycare Centers": testCentersLayer
};
var layerControl = L.control.layers( {}, overlayLayers ).addTo(map);