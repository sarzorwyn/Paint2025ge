"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import mapboxgl, { DataDrivenPropertyValueSpecification } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
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
  const mapRef = useRef<mapboxgl.Map>(null);
  const { x, y, tooltipRef } = useMouse<HTMLDivElement>();
  let hoveredPolygonId: string | number | null = null;
  const selectedPolygonIdRef = useRef<null | string>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [selectedParty, setSelectedParty] = useState<string | null>(null);

  const fillColorExpression = useMemo<
    DataDrivenPropertyValueSpecification<string>
  >(
    () => [
      "match",
      ["get", "NEW_ED"],
      ...[...partyAreas].flatMap((pArea) => {
        return [pArea[0], getHexPartyColor(pArea[1])];
      }),
      "#e0e0ff", // Default color
    ],
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
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API;

    mapRef.current = createMap(mapContainerRef.current!);
    mapRef.current!.on("load", () => {
      mapLoadProperties(mapRef.current!, fillColorExpression);
    });

    const handleClickEmpty = (e) => {
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
    if (selectedParty !== null) {
      mapRef.current!.getCanvas().style.cursor = "crosshair";
    } else {
      mapRef.current!.getCanvas().style.cursor = "grab";
    }

    const handleMouseMove = (e) => {
      if (e.features.length > 0) {
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
        hoveredPolygonId = e.features[0].id!;
        mapRef.current?.setFeatureState(
          { source: "elecBoundsSource", id: hoveredPolygonId! },
          { hover: true }
        );

        setHoverId(e.features[0].properties.NEW_ED);
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

    const handleClickMap = (e) => {
      selectedPolygonIdRef.current = handleMapClick(
        mapRef.current,
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
  }, [selectedParty]);

  const handlePickerSelect = useCallback(
    (e: { currentTarget: { id: React.SetStateAction<null> } | null }) => {
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
