 
const EQurl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(EQurl).then(function (data) {
 
console.log(data);

createFeatures(data.features);
});

function markerSize(mag) {
    
    return mag * 10000; 
}


function chooseColor(depth){
    
    var color;

    if (depth < 10) color =  "#00FF00";
    else if (depth < 30) color =  "blue";
    else if (depth < 50) color =  "lightblue";
    else if (depth < 70) color =  "green";
    else if (depth < 90) color =  "lightgreen";
    else color =  "#FF0000";

    console.log(' depth : ', depth, ' color : ',color);
    return color;
    
  }
  

function createFeatures(earthquakeData) {

    // Define a function.
    function onEachFeature(feature, layer) {
      layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3><hr><p>Date: ${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
    }
  
    // Create a GeoJSON layer.
    var earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature,
  
            pointToLayer: function(feature, latlng) {

        var markers = {
          radius: markerSize(feature.properties.mag),
          fillColor: chooseColor(feature.geometry.coordinates[2]),
          fillOpacity: 0.10,
          color: "black",
          stroke: true,
          weight: 0.5
        }
        return L.circle(latlng,markers);
      }
    });

      //createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

    let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    var overlayMaps = {
    Earthquakes: earthquakes
    };
    // Create map
    var myMap = L.map("map", {
      center: [37.09, -95.71],
      zoom: 5,
      layers: [streetmap, earthquakes]
    });
  
	var legend = L.control({position: "bottomright"});
	  
    legend.onAdd = function () {
        var div = L.DomUtil.create("div", "info legend");
        var depth = [-10, 10, 30, 50, 70, 90];
    
        div.innerHTML += "<h3 style='text-align: center'>Depth</h3>";
    
        //https://stackoverflow.com/questions/44871088/javascript-innerhtml-not-working-on-div
        for (var i = 0; i < depth.length; i++) {
            div.innerHTML +=
                '<i style="background:' + chooseColor(depth[i] + 1) + '; width: 20px; height: 20px; display: inline-block;"></i> ' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
        }
        return div;
    };
      legend.addTo(myMap)
      
     
  };