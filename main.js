/* 
 * This script is the starting point for our leaflet work.  It should be loaded
 * after leaflet, jQuery and it's required assets.
 */

// create map
var map = L.map('map', {
    center: new L.LatLng(44.4825904, -73.2226484),
    zoom: 13
});	

// leaflet-hash plugin handles updating url
var hash = new L.Hash(map);

// define which tiles to use as basemap
var baseMap = L.tileLayer('https://{s}.tiles.mapbox.com/v3/landplanner.hc15p9k5/{z}/{x}/{y}.png', {
	maxZoom: 18,
	attribution: 'Mapbox, Openstreetmap Contributors'
});

// Adding the centers
var centersLayer = L.markerClusterGroup( {maxClusterRadius: 40} );
$.getJSON("assets/childcare-centers.geojson", function(data) {
  var geojson = L.geoJson(data, {
	 onEachFeature: function (feature, layer) {
		
		// Add a custom icon for the chilcare centers
		switch( feature.properties.bizType ) {
			case "center": 	layer.setIcon( iconCareCenter ); break;
			case "in home": layer.setIcon( iconInHome ); break;
		}
		
		// set popup message
		var popupMarkup;
		popupMarkup = "<h3>" + feature.properties.name + "</h3>";
		popupMarkup += "<h5>" + feature.properties.address1 + "</h5>";
		popupMarkup += "<table class='table table-striped table-condensed'>";
		popupMarkup += "<tr><td>Rating</td><td>" + feature.properties.rating + "</td></tr>";
		popupMarkup += "<tr><td>Ages</td><td>" + feature.properties.ages + "</td></tr>";
		popupMarkup += "<tr><td>Capacity</td><td>" + feature.properties.capacity + "</td></tr>";
		popupMarkup += "</table>";
		layer.bindPopup( popupMarkup	);
	 }
  });
	centersLayer.addLayer( geojson );
});

// Adding ward boundaries
var wardsLayer = L.layerGroup();
var wardColors = ['blue', 'teal', 'teal', 'blue', 'purple', 'blue', 'purple', 'purple'];
$.getJSON("assets/ward-borders.geojson", function(data) {
  var geojson = L.geoJson(data, {
		
		// set ward color
		style: function(feature) {
			return {color: wardColors[ feature.properties.label - 1 ]}
    },
		opacity: 0.01,
	
		// digest each feature
		onEachFeature: function (feature, layer) {
			// Add a custom icon fot the chilcare centers
			var popupMarkup;
			popupMarkup = feature.properties.name;
			layer.bindPopup( popupMarkup	);
		}
  });
	wardsLayer.addLayer( geojson );
});


// Add city of Burlington boundary (non-geojson format, see poltical-borders.js)
var cityBounds = L.geoJson(political_borders, { style: {'color': 'black'}, "opacity": 0.8 });

// add layers to the map
map.addLayer( baseMap );
map.addLayer( wardsLayer );
map.addLayer( cityBounds );
map.addLayer( centersLayer );

// a layer control
// NOTE: we may want to replace this with a different control that makes it faster for users to toggle things on/off
var overlayLayers = { 
	"Show City Boundaries": cityBounds,
	"Show Ward Boundaries": wardsLayer,
	"Show Daycare Centers": centersLayer
};
var layerControl = L.control.layers( {}, overlayLayers ).addTo(map);