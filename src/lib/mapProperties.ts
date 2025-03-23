import maplibregl, { DataDrivenPropertyValueSpecification, Map } from "maplibre-gl";

export const createMap = (mapContainer: HTMLDivElement) => (
    new maplibregl.Map({
        container: mapContainer,
        style: {
          version: 8,
          sources: {},
          layers: []
      },
        center: [103.81861913147856, 1.3526551622117324],
        zoom: 10,
        minZoom: 9,
        maxZoom: 12.5,
    })
)


export const mapLoadProperties = (map: Map, fillColorExpression: DataDrivenPropertyValueSpecification<string>) => {
    if (map.getSource("elecBoundsSource") == null) {
        map.addSource("elecBoundsSource", {
          type: "geojson",
          data: "/geojsons/ElectoralBoundary2025GEOJSON.geojson",
          promoteId: "FID",
        });
      }

      map.addLayer({
        id: "background-layer",
        type: "background",
        paint: {
          "background-color": "#efefef",
          "background-opacity": 1,
        },
      });

      map.addLayer({
        id: "elecBounds",
        type: "fill",
        source: "elecBoundsSource",
        layout: {},
        paint: {
          "fill-color": fillColorExpression,
          "fill-opacity": 1,
        },
      });

      map.addLayer({
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

    map.easeTo({
      zoom: 10.3,
      duration: 3000
    });
}