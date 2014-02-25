/* 
 * This script is the starting point for our leaflet work.  It should be loaded
 * after leaflet, jQuery and it's required assets.
 */
 
// create map
var map = L.map('map').setView([44.4825904, -73.2226484], 13);

// define which tiles to use as background
L.tileLayer('https://{s}.tiles.mapbox.com/v3/landplanner.hc15p9k5/{z}/{x}/{y}.png', {
	maxZoom: 18,
	attribution: 'Mapbox, Openstreetmap Contributors'
}).addTo(map);

// Adding the centers as a pure geojson file - add new features here:
// http://geojson.io/#id=gist:wboykinm/2f592dd705c119a22f03&map=13/44.4731/-73.2309
// . . . then copy new JSON back into this file before re-launching page
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
  geojson.addTo(map);
});

// Add polygon for the city of Burlington
var myStyle = {
	"color": "green",
	"weight": 5,
	"opacity": 0.65
};
L.geoJson(political_borders, { style: myStyle }).addTo(map);
