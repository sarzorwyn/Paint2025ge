"use client";

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { useMouse } from '../lib/useMouse';
import { politicalParties } from '@/lib/politicalParties';
import { MapLegend } from './mapLegend';


const MapElement = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef<mapboxgl.Map>(null); // <mapboxgl.Map | null>
  const {x, y, tooltipRef} = useMouse<HTMLDivElement>();
  let hoveredPolygonId = null;
  let selectedPolygonId = null;
  const [hoverDesc, setHoverDesc] = useState(null);

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API;
    

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/empty-v9',
      center: [103.81861913147856, 1.3526551622117324],
      zoom: 10.3,
      minZoom: 9,
      maxZoom: 12.5,
      logoPosition: 'bottom'
    });


    mapRef.current.on('load', () => {
      if (mapRef.current.getSource('elecBoundsSource') == null) {
      mapRef.current.addSource('elecBoundsSource', {
        type: 'geojson',
        data: '/geojsons/ElectoralBoundary2025GEOJSON.geojson',
        promoteId: 'FID'
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
          'line-width': ['case', ['boolean', ['feature-state', 'selected'], false], 5, ['boolean', ['feature-state', 'hover'], false],  3, 1]
        }
      });

      mapRef.current.on('click', (e) => {
        if (selectedPolygonId !== null) {
          mapRef.current.setFeatureState(
            { source: 'elecBoundsSource', id: selectedPolygonId },
            { selected: false }
          );
        }
      });

      mapRef.current.on('click', 'elecBounds', (e) => {
        

        if (e && e.features.length > 0) {
          selectedPolygonId = e.features[0].id;
          mapRef.current.setFeatureState(
            { source: 'elecBoundsSource', id: selectedPolygonId },
            { selected: true }
          );

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
          setHoverDesc(e.features[0].properties.ED_DESC.toLowerCase().replace(/\b\w/g, s => s.toUpperCase()));
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
        setHoverDesc(null);
      });


    });
  }, []);
  
  return (
    <TooltipPrimitive.TooltipProvider>
      <TooltipPrimitive.Tooltip delayDuration={0} open={hoverDesc !== null} >
        <div id='mapContainer' ref={tooltipRef} className="relative w-full h-[60vh] max-w-5xl mx-auto my-8 rounded-2xl shadow-lg overflow-hidden">
          <MapLegend/>
          <TooltipPrimitive.TooltipTrigger  asChild>
            <div id="map" ref={mapContainerRef} className="absolute w-full h-full"/>
          </TooltipPrimitive.TooltipTrigger>
          
        </div>
        <TooltipPrimitive.TooltipContent
            align="start"
            alignOffset={x}
            sideOffset={-y + 3}
            hideWhenDetached
            className="bg-white p-1 px-2 rounded shadow-md overflow-hidden"
          >
            {hoverDesc}
        </TooltipPrimitive.TooltipContent>
      </TooltipPrimitive.Tooltip>
    </TooltipPrimitive.TooltipProvider>

  );
};

export default MapElement;