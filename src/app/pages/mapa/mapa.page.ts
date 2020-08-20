import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
declare var mapboxgl: any;

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit, AfterViewInit {
  // latitud y longitudrespectivamente
  lat: number;
  lng: number;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
              // leo el parametro enviado por la url del geo
    let geo: any = this.route.snapshot.paramMap.get('geo');
    // corto la palabra geo de todo lo que envio de la url, extryendo solo las coordenadas
    geo = geo.substr(4);
    // separo las coordenadas por la ',' para tener dos arreglos distintos
    geo = geo.split(',');

    this.lat = Number(geo[0]);
    this.lng = Number(geo[1]);

    console.log(this.lat, this.lng);

  }

  // se dispara despues de la inicializacion del componente ngoninit
  ngAfterViewInit(){

    mapboxgl.accessToken = 'pk.eyJ1IjoiY3Jpc3RpYW5hbG9uc29yIiwiYSI6ImNrZHJsczBpOTBkMnIyd251MmdhNWsyemgifQ.cRfPqthZV0NXhZZYcYjdAw';
    const map = new mapboxgl.Map({
    style: 'mapbox://styles/mapbox/light-v10',
    // en mapbox va primero la longitud y despues la latitud
    center: [this.lng, this.lat],
    zoom: 15.5,
    pitch: 35,
    bearing: -17.6,
    container: 'map',
    antialias: true
    });

    map.on('load', () => {

      // re escalo el tamaño del mapa al que necesito y al que lo llame en el estilo
      map.resize();

      //marker
      const marker = new mapboxgl.Marker()
      .setLngLat([this.lng, this.lat])
      .addTo(map);

      // Insert the layer beneath any symbol layer.
      const layers = map.getStyle().layers;

      let labelLayerId;
      for (let i = 0; i < layers.length; i++) {
        if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
          labelLayerId = layers[i].id;
          break;
        }
      }

      map.addLayer({
        'id': '3d-buildings',
        'source': 'composite',
        'source-layer': 'building',
        'filter': ['==', 'extrude', 'true'],
        'type': 'fill-extrusion',
        'minzoom': 15,
        'paint': {
          'fill-extrusion-color': '#aaa',

          // use an 'interpolate' expression to add a smooth transition effect to the
          // buildings as the user zooms in
          'fill-extrusion-height': [
          'interpolate',
          ['linear'],
          ['zoom'],
          15,
          0,
          15.05,
          ['get', 'height']
          ],
          'fill-extrusion-base': [
          'interpolate',
          ['linear'],
          ['zoom'],
          15,
          0,
          15.05,
          ['get', 'min_height']
          ],
          'fill-extrusion-opacity': 0.6
        }
      }, labelLayerId);
    });
  }
}
