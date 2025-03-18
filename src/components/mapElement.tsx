"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { useMouse } from "../lib/useMouse";
import { politicalParties } from "@/lib/politicalParties";
import MapLegend from "./mapLegend";
import CirclePicker from "./circlePicker";
import {
  handleMapClick,
  getHoverDesc,
} from "@/handler/mapHandlers";
import { getHexPartyColor, getHoverColor } from "@/handler/partyColorHandlers";

const MapElement = ({
  updateArea,
  partyAreas,
  partySeats,
}: {
  updateArea: (area: string, party: string) => void;
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

  const fillColorExpression = useMemo(
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

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/empty-v9",
      center: [103.81861913147856, 1.3526551622117324],
      zoom: 10.3,
      minZoom: 9,
      maxZoom: 12.5,
      logoPosition: "bottom",
    });

    mapRef.current.on("load", () => {
      if (mapRef.current?.getSource("elecBoundsSource") == null) {
        mapRef.current?.addSource("elecBoundsSource", {
          type: "geojson",
          data: "/geojsons/ElectoralBoundary2025GEOJSON.geojson",
          promoteId: "FID",
        });
      }

      mapRef.current?.addLayer({
        id: "background-layer",
        type: "background",
        paint: {
          "background-color": "#efefef",
          "background-opacity": 1,
        },
      });

      mapRef.current?.addLayer({
        id: "elecBounds",
        type: "fill",
        source: "elecBoundsSource",
        layout: {},
        paint: {
          "fill-color": fillColorExpression,
          "fill-opacity": 1,
        },
      });

      mapRef.current?.addLayer({
        id: "outline",
        type: "line",
        source: "elecBoundsSource",
        layout: {},
        paint: {
          "line-color": "#444444",
          "line-width": [
            "case",
            ["boolean", ["feature-state", "selected"], false],
            5,
            ["boolean", ["feature-state", "hover"], false],
            3,
            1,
          ],
        },
      });

      mapRef.current?.on("click", (e) => {
        const features = mapRef.current?.queryRenderedFeatures(e.point);
        // If no features were clicked, it means the background was clicked
        if (features.length === 0) {
          setSelectedParty(null);
          if (selectedPolygonIdRef.current !== null) {
            mapRef.current?.setFeatureState(
              { source: "elecBoundsSource", id: selectedPolygonIdRef.current },
              { selected: false }
            );
            selectedPolygonIdRef.current = null;
          }
        }
      });
    });
  }, []);

  useEffect(() => {
    mapRef.current.on("click", "elecBounds", (e) => {
      selectedPolygonIdRef.current = handleMapClick(
        mapRef,
        selectedParty,
        e,
        selectedPolygonIdRef.current
      );
      updateArea(selectedPolygonIdRef.current, selectedParty);
    });

    mapRef.current?.on("mousemove", "elecBounds", (e) => {
      if (e.features.length > 0) {
        if (selectedParty === null) {
          mapRef.current.getCanvas().style.cursor = "pointer";
        } else {
          mapRef.current.getCanvas().style.cursor = "crosshair";
        }
        if (hoveredPolygonId !== null) {
          mapRef.current.setFeatureState(
            { source: "elecBoundsSource", id: hoveredPolygonId },
            { hover: false }
          );
        }
        hoveredPolygonId = e.features[0].id;
        mapRef.current?.setFeatureState(
          { source: "elecBoundsSource", id: hoveredPolygonId },
          { hover: true }
        );

        setHoverId(e.features[0].properties.NEW_ED);
      }
    });

    mapRef.current.on("mouseleave", "elecBounds", () => {
      if (selectedParty === null) {
        mapRef.current.getCanvas().style.cursor = "grab";
      } else {
        mapRef.current.getCanvas().style.cursor = "crosshair";
      }
      if (hoveredPolygonId !== null) {
        mapRef.current.setFeatureState(
          { source: "elecBoundsSource", id: hoveredPolygonId },
          { hover: false }
        );
      }
      hoveredPolygonId = null;
      setHoverId(null);
    });

    if (selectedParty !== null) {
      mapRef.current.getCanvas().style.cursor = "crosshair";
    } else {
      mapRef.current.getCanvas().style.cursor = "grab";
    }
  }, [selectedParty]);

  const handlePickerSelect = useCallback(
    (e: { currentTarget: { id: React.SetStateAction<null> } | null }) => {
      if (e.currentTarget === null) {
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
        <div >
          <div
            id="rectMapContainer"
            ref={tooltipRef}
            className="relative w-full h-[60vh] max-w-5xl mx-auto my-8 rounded-2xl shadow-lg overflow-hidden"
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
