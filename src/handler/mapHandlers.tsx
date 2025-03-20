import { constituencies } from "@/lib/constituencies";
import { politicalParties } from "@/lib/politicalParties";
import { Map } from "mapbox-gl";
import { RefObject } from "react";

export const handleMapClick = (
  map: Map,
  selectedParty: string | null,
  e: mapboxgl.MapMouseEvent,
  selectedPolygonId: string | null
) => {
  let newSelectedPolygonId = null;
  if (selectedPolygonId !== null) {
    map.setFeatureState(
      { source: "elecBoundsSource", id: selectedPolygonId },
      { selected: false }
    );
  }
  if (e && e.features.length > 0) {
    newSelectedPolygonId = e.features[0].id;

    if (selectedParty == null) {
      map.setFeatureState(
        { source: "elecBoundsSource", id: newSelectedPolygonId },
        { selected: true }
      );
      map.flyTo({
        center: e.lngLat,
        zoom: 10.9,
      });
    }
  }
  return newSelectedPolygonId;
};

export const getHoverDesc = (hoverCode: string | null) => {
  const area = constituencies.find((area) => area.code === hoverCode);

  if (area === undefined) {
    return "";
  }

  return (
    <>
      {area?.fullname} <br /> {area?.seats + " seats"}
    </>
  );
};