import { constituencies } from "@/lib/constituencies";
import { Map } from "maplibre-gl";

export const handleMapClick = (
  map: Map,
  selectedParty: string | null,
  e: maplibregl.MapLayerMouseEvent,
  selectedPolygonId: string | null
) => {
  let newSelectedPolygonId: string | null = null;
  if (selectedPolygonId !== null) {
    map.setFeatureState(
      { source: "elecBoundsSource", id: selectedPolygonId },
      { selected: false }
    );
  }
  if (e && e.features!.length > 0) {
    newSelectedPolygonId = String(e.features![0].id!);

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