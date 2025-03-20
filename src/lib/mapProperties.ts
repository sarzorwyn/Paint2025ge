import mapboxgl, { DataDrivenPropertyValueSpecification, Map } from "mapbox-gl";

export const createMap = (mapContainer: HTMLDivElement) => (
    new mapboxgl.Map({
        container: mapContainer,
        style: "mapbox://styles/mapbox/empty-v9",
        center: [103.81861913147856, 1.3526551622117324],
        zoom: 10.3,
        minZoom: 9,
        maxZoom: 12.5,
        logoPosition: "bottom",
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
}