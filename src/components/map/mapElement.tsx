"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import maplibregl, { DataDrivenPropertyValueSpecification, ExpressionSpecification } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { useMouse } from "../../lib/useMouse";
import MapLegend from "./mapLegend";
import CirclePicker from "./circlePicker";
import { handleMapClick, getHoverDesc } from "@/handler/mapHandlers";
import { getHexPartyColor, getHoverColor } from "@/handler/partyColorHandlers";
import { createMap, mapLoadProperties } from "@/lib/mapProperties";

const MapElement = ({
  updateArea,
  partyAreas,
  partySeats,
}: {
  updateArea: (areaId: string, party: string) => void;
  partyAreas: Map<string, string | null>;
  partySeats: Map<string, number>;
}): React.JSX.Element => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map>(null);
  const { x, y, tooltipRef } = useMouse<HTMLDivElement>();
  const selectedPolygonIdRef = useRef<null | string>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [selectedParty, setSelectedParty] = useState<string | null>(null);

  const fillColorExpression = useMemo<DataDrivenPropertyValueSpecification<string>>(
    () => [
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
    mapRef.current?.setPaintProperty(
      "elecBounds",
      "fill-color",
      fillColorExpression
    );
  }, [fillColorExpression]);

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
    mapRef.current!.on("load", () => {
      mapLoadProperties(mapRef.current!, fillColorExpression);
    });
  }, [fillColorExpression])

  useEffect(() => {
    let hoveredPolygonId: string | number | null = null;

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
        if (hoveredPolygonId !== null) {
          mapRef.current!.setFeatureState(
            { source: "elecBoundsSource", id: hoveredPolygonId },
            { hover: false }
          );
        }
        hoveredPolygonId = features[0].id!;
        mapRef.current?.setFeatureState(
          { source: "elecBoundsSource", id: hoveredPolygonId! },
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
      if (hoveredPolygonId !== null) {
        mapRef.current!.setFeatureState(
          { source: "elecBoundsSource", id: hoveredPolygonId },
          { hover: false }
        );
      }
      hoveredPolygonId = null;
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
  }, [selectedParty, updateArea]);

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
      <TooltipPrimitive.Tooltip delayDuration={0} open={hoverId !== null}>
        <div>
          <div
            id="rectMapContainer"
            ref={tooltipRef}
            className="relative w-full h-[60vh] max-w-5xl mx-auto my-8 rounded-2xl shadow-sm overflow-hidden"
          >
            <MapLegend partySeats={partySeats} />
            <CirclePicker
              onSelect={handlePickerSelect}
              selectedParty={selectedParty}
            />
            <TooltipPrimitive.TooltipTrigger asChild>
              <div
                id="map"
                ref={mapContainerRef}
                className="absolute w-full h-full"
              />
            </TooltipPrimitive.TooltipTrigger>
          </div>
          <TooltipPrimitive.TooltipContent
            align="start"
            alignOffset={x}
            sideOffset={-y + 3}
            hideWhenDetached
            className={`shadow-md rounded`}
          >
            <div
              className={`bg-white p-1 px-2 rounded  overflow-hidden border-l-5 ${getHoverColor(
                selectedParty,
                hoverId,
                partyAreas
              )}`}
            >
              {getHoverDesc(hoverId)}
            </div>
          </TooltipPrimitive.TooltipContent>
        </div>
      </TooltipPrimitive.Tooltip>
    </TooltipPrimitive.TooltipProvider>
  );
};

export default MapElement;
