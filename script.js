// PREGUNTAS:
// - ¿Cómo subir archivo de local a red? Teniendo base de datos en local y archivos php la mejor manera es webpack?

// - Me hubiera gustado usar una api como sweetAlert para que la información quede mejor

// - Cómo añadir opción "elige un tipo de restaurante" en el select


var map = L.map('mapid').on('load', onMapLoad).setView([41.387213, 2.170042], 14);
var tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(map);


// en el clusters almaceno todos los markers
var markers = L.markerClusterGroup();
var data_markers = [];
var kind_food = [];


// markers personalizados
var leafletIcon = L.icon({
	iconUrl: 'imgs/pinplace.svg', 
	iconSize: [38,95],
	iconAnchor: [11,80],
	popupAnchor: [9,-70]
});

function onMapLoad() {
	const api_url = 'api/apiRestaurants.php';

	// FASE 3.1
	// 1) Relleno el data_markers con una petición a la api
	// 2) Añado de forma dinámica en el select los posibles tipos de restaurantes
	
	$.getJSON(api_url, function(data){
		$.each(data, function(index, item) {
			data_markers.push(item);

			let tipoComida = item.kind_food.split(',');

			for(let i=0;  i<tipoComida.length;  i++) {
				if (kind_food.indexOf(tipoComida[i])==-1){
					kind_food.push(tipoComida[i]);
					$('#kind_food_selector').html($('#kind_food_selector').html()+`
					<option>${tipoComida[i]}</option>`);
				}
			}
		});
	});
}


// 3) Llamo a la función para --> render_to_map(data_markers, 'all'); <-- para mostrar restaurantes en el mapa
function render_to_map(data_markers, filter) {
	$.each(data_markers, function(index, item){
		let kind = item.kind_food;
		if(kind.indexOf(filter) >= 0){
			let latitude = item.lat;
			let longitude = item.lng;
			let name = item.name;
			let address = item.address;
			markers.addLayer(
				L.marker([latitude, longitude], {icon:leafletIcon})
				.bindPopup('<h3>' + name + '</h3>' + address)).addTo(map);	
		}
		
	});
}


// FASE 3.2
// 		1) Limpio todos los marcadores
// 		2) Realizo un bucle para decidir que marcadores cumplen el filtro, y los agregamos al mapa
$('#kind_food_selector').on('change', function() {
	$.each(data_markers, function(index, marker) {
		console.log();
		markers.clearLayers();
	})

	let filter = this.value;
	render_to_map(data_markers, filter);
});


