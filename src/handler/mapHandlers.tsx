import { constituencies } from "@/lib/constituencies";
import { politicalParties } from "@/lib/politicalParties";
import { Map } from "mapbox-gl";
import { RefObject } from "react";

export const handleMapClick = (
  mapRef: RefObject<Map>,
  selectedParty: string | null,
  e: mapboxgl.MapMouseEvent,
  selectedPolygonId: string | null
) => {
  let newSelectedPolygonId = null;
  if (selectedPolygonId !== null) {
    mapRef.current.setFeatureState(
      { source: "elecBoundsSource", id: selectedPolygonId },
      { selected: false }
    );
  }
  if (e && e.features.length > 0) {
    newSelectedPolygonId = e.features[0].id;

    if (selectedParty !== null) {
      mapRef.current.setFeatureState(
        { source: "elecBoundsSource", id: newSelectedPolygonId },
        { party: selectedParty }
      );
    } else {
      mapRef.current.setFeatureState(
        { source: "elecBoundsSource", id: newSelectedPolygonId },
        { selected: true }
      );
      mapRef.current.flyTo({
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

export const partyColor = (party: string | null) => {
  return (
    politicalParties.find((polParty) => polParty.name === party)?.hex ||
    "#e0e0ff"
  );
};

export const getHoverColor = (selectedParty: string | null, hoverId: string | null, partyAreas: Map<string, string>) => {
  return politicalParties.find((polParty) => polParty.name === selectedParty)?.hoverColor 
  || (hoverId &&  politicalParties.find((polParty) => polParty.name === partyAreas.get(hoverId))?.hoverColor)
  || "bg-gray-100";
}