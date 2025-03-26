"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import maplibregl, { ExpressionSpecification } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import CirclePicker from "./circlePicker";
import { handleMapClick } from "@/handler/mapHandlers";
import { getHexPartyColor } from "@/handler/partyColorHandlers";
import { createMap, mapLoadProperties } from "@/lib/mapProperties";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import MapTooltip from "./mapTooltip";

const MapContainer = ({
  mapContainerRef,
}: {
  mapContainerRef: React.RefObject<HTMLDivElement | null>;
}) => {
  return (
    <div id="map" ref={mapContainerRef} className="absolute w-full h-full" />
  );
};

const MapElement = ({
  children,
  updateArea,
  partyAreas,
}: {
  children?: React.ReactNode;
  updateArea: (areaId: string, party: string) => void;
  partyAreas: Map<string, string | null>;
}): React.JSX.Element => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map>(null);
  // const { x, y, tooltipRef } = useMouse<HTMLDivElement>();
  const selectedPolygonIdRef = useRef<null | string>(null);
  const hoveredPolygonIdRef = useRef<null | string>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [selectedParty, setSelectedParty] = useState<string | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null); // Use ref to store the element

  const fillColorExpression = useCallback(
    () =>
      [
        "match",
        ["get", "NEW_ED"],
        ...[...partyAreas].flatMap((pArea) => {
          return [pArea[0], getHexPartyColor(pArea[1])];
        }),
        "#e0e0ff", // Default color
      ] as unknown as ExpressionSpecification,
    [partyAreas]
  );

  useEffect(() => {
    mapRef.current = createMap(mapContainerRef.current!);

    const handleClickEmpty = (e: maplibregl.MapMouseEvent) => {
      const features = mapRef.current!.queryRenderedFeatures(e.point);
      // If no features were clicked, it means the background was clicked
      if (features.length === 0) {
        setSelectedParty(null);
        if (selectedPolygonIdRef.current !== null) {
          mapRef.current!.setFeatureState(
            { source: "elecBoundsSource", id: selectedPolygonIdRef.current },
            { selected: false }
          );
          selectedPolygonIdRef.current = null;
        }
      }
    };

    mapRef.current!.on("click", handleClickEmpty);

    return () => {
      mapRef.current!.off("click", handleClickEmpty);
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const handleMapLoad = () => {
      mapLoadProperties(map, fillColorExpression());
    };

    map.on("load", handleMapLoad);

    const updateFillColor = () => {
      if (map.getLayer("elecBounds")) {
        map.setPaintProperty("elecBounds", "fill-color", fillColorExpression());
      } else {
        console.warn("Layer 'elecBounds' not found.");
      }
    };

    map.on("styledata", updateFillColor); // Listen for style reloads

    if (map.isStyleLoaded()) {
      updateFillColor();
    } else {
      setTimeout(updateFillColor, 500); // Try again after a delay
    }

    return () => {
      map.off("load", handleMapLoad);
      map.off("styledata", updateFillColor);
    };
  }, [fillColorExpression]);

  useEffect(() => {
    if (selectedParty !== null) {
      mapRef.current!.getCanvas().style.cursor = "crosshair";
    } else {
      mapRef.current!.getCanvas().style.cursor = "grab";
    }

    const handleMouseMove = (e: maplibregl.MapLayerMouseEvent) => {
      const features = e.features;
      if (features && features.length > 0) {
        if (selectedParty === null) {
          mapRef.current!.getCanvas().style.cursor = "pointer";
        } else {
          mapRef.current!.getCanvas().style.cursor = "crosshair";
        }
        if (hoveredPolygonIdRef.current !== null) {
          mapRef.current!.setFeatureState(
            { source: "elecBoundsSource", id: hoveredPolygonIdRef.current },
            { hover: false }
          );
        }
        hoveredPolygonIdRef.current = features[0].id as string;
        mapRef.current?.setFeatureState(
          { source: "elecBoundsSource", id: hoveredPolygonIdRef.current },
          { hover: true }
        );

        if (features[0].properties) {
          setHoverId(features[0].properties.NEW_ED);
        }
      }
    };

    const handleMouseLeave = () => {
      if (selectedParty === null) {
        mapRef.current!.getCanvas().style.cursor = "grab";
      } else {
        mapRef.current!.getCanvas().style.cursor = "crosshair";
      }
      if (hoveredPolygonIdRef.current !== null) {
        mapRef.current!.setFeatureState(
          { source: "elecBoundsSource", id: hoveredPolygonIdRef.current },
          { hover: false }
        );
      }
      hoveredPolygonIdRef.current = null;
      setHoverId(null);
    };

    const handleClickMap = (e: maplibregl.MapMouseEvent) => {
      selectedPolygonIdRef.current = handleMapClick(
        mapRef.current!,
        selectedParty,
        e,
        selectedPolygonIdRef.current
      );
      if (selectedParty !== null && selectedPolygonIdRef.current !== null) {
        updateArea(selectedPolygonIdRef.current, selectedParty);
      }
    };

    mapRef.current?.on("click", "elecBounds", handleClickMap);
    mapRef.current?.on("mousemove", "elecBounds", handleMouseMove);
    mapRef.current?.on("mouseleave", "elecBounds", handleMouseLeave);

    return () => {
      mapRef.current?.off("mousemove", "elecBounds", handleMouseMove);
      mapRef.current?.off("mouseleave", "elecBounds", handleMouseLeave);
      mapRef.current?.off("click", "elecBounds", handleClickMap);
    };
  }, [selectedParty, setHoverId, updateArea]);

  const handlePickerSelect = useCallback(
    (e: React.MouseEvent<Element, MouseEvent>) => {
      if (e.currentTarget == null) {
        setSelectedParty(null);
      } else {
        setSelectedParty(e.currentTarget.id);
      }
    },
    []
  );

  return (
    <TooltipPrimitive.TooltipProvider>
      <div
        id="rectMapContainer"
        ref={tooltipRef}
        className="relative w-full h-[60vh] max-w-5xl mx-auto my-8 rounded-2xl shadow-sm overflow-hidden"
      >
        {children}
        <MapContainer mapContainerRef={mapContainerRef} />

        <CirclePicker
          selectedParty={selectedParty}
          onSelect={handlePickerSelect}
        />
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <MapTooltip
            hoverId={hoverId}
            tooltipRef={tooltipRef}
            selectedParty={selectedParty}
            partyAreas={partyAreas}
          />
        </div>
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none"></div>
      </div>
    </TooltipPrimitive.TooltipProvider>
  );
};

export default MapElement;
