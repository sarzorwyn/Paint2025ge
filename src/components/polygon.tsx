"use client";

import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

const Polygon = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef<mapboxgl.Map>(null); // <mapboxgl.Map | null>

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/empty-v9',
      center: [103.81861913147856, 1.3526551622117324],
      zoom: 10.3
    });


    mapRef.current.on('load', () => {
      if (mapRef.current.getSource('sgMap') == null) {
      mapRef.current.addSource('sgMap', {
        type: 'geojson',
        data: '/geojsons/ElectoralBoundary2025GEOJSON.geojson'
      });}

      mapRef.current.addLayer({
        id: 'maine',
        type: 'fill',
        source: 'sgMap',
        layout: {},
        paint: {
          'fill-color': '#0080ff',
          'fill-opacity': 0.5
        }
      });

      mapRef.current.addLayer({
        id: 'outline',
        type: 'line',
        source: 'sgMap',
        layout: {},
        paint: {
          'line-color': '#000',
          'line-width': 1
        }
      });
    });
  }, []);

  return <div id="map" ref={mapContainerRef} className="w-full h-[60vh] max-w-5xl mx-auto my-8 rounded-2xl shadow-lg overflow-hidden" />;
};

export default Polygon;