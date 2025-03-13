"use client";

import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

const MapElement = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef<mapboxgl.Map>(null); // <mapboxgl.Map | null>
  let hoveredPolygonId = null;

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API;
    

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/empty-v9',
      center: [103.81861913147856, 1.3526551622117324],
      zoom: 10.3,
      minZoom: 9
    });


    mapRef.current.on('load', () => {
      if (mapRef.current.getSource('elecBoundsSource') == null) {
      mapRef.current.addSource('elecBoundsSource', {
        type: 'geojson',
        data: '/geojsons/ElectoralBoundary2025GEOJSON.geojson',
        generateId: true
      });}

      mapRef.current.addLayer({
        id: 'elecBounds',
        type: 'fill',
        source: 'elecBoundsSource',
        layout: {},
        paint: {
          'fill-color': '#e0e0ff',
          'fill-opacity': 0.3
        }
      });

      mapRef.current.addLayer({
        id: 'outline',
        type: 'line',
        source: 'elecBoundsSource',
        layout: {},
        paint: {
          'line-color': '#444444',
          'line-width': ['case',['boolean', ['feature-state', 'hover'], false], 3, 1]
        }
      });

      mapRef.current.on('click', 'elecBounds', (e) => {
        if (e.features.length > 0 && hoveredPolygonId !== null) {
          mapRef.current.flyTo({
            center: e.lngLat,
            zoom: 10.9
          });
        }
      });

      mapRef.current.on('mousemove', 'elecBounds', (e) => {
        if (e.features.length > 0) {
          mapRef.current.getCanvas().style.cursor = 'pointer';
          if (hoveredPolygonId !== null) {
            mapRef.current.setFeatureState(
              { source: 'elecBoundsSource', id: hoveredPolygonId },
              { hover: false }
            );
          }
          hoveredPolygonId = e.features[0].id;
          mapRef.current.setFeatureState(
            { source: 'elecBoundsSource', id: hoveredPolygonId },
            { hover: true }
          );
        }
      });

      mapRef.current.on('mouseleave', 'elecBounds', () => {
        mapRef.current.getCanvas().style.cursor = 'grab';
        if (hoveredPolygonId !== null) {
          mapRef.current.setFeatureState(
            { source: 'elecBoundsSource', id: hoveredPolygonId },
            { hover: false }
          );
        }
        hoveredPolygonId = null;
      });


    });
  }, []);

  return <div id="map" ref={mapContainerRef} className="w-full h-[60vh] max-w-5xl mx-auto my-8 rounded-2xl shadow-lg overflow-hidden" />;
};

export default MapElement;