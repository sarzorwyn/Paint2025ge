export const handleMapClick = (mapRef, selectedParty, e: mapboxgl.MapMouseEvent, selectedPolygonId) => {
    let newSelectedPolygonId = null;
    if (selectedPolygonId !== null) {
        mapRef.current.setFeatureState(
        { source: 'elecBoundsSource', id: selectedPolygonId },
        { selected: false }
        );
    }
    if (e && e.features.length > 0) {
      newSelectedPolygonId = e.features[0].id;

      if (selectedParty !== null) {
        mapRef.current.setFeatureState(
          { source: 'elecBoundsSource', id: newSelectedPolygonId },
          { party: selectedParty}
        );
      } else {
        mapRef.current.setFeatureState(
            { source: 'elecBoundsSource', id: newSelectedPolygonId },
            { selected: true }
        );
        mapRef.current.flyTo({
          center: e.lngLat,
          zoom: 10.9
        });
      }
    }
    return newSelectedPolygonId;
  };