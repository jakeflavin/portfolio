import React, { useRef, useState, useEffect, useCallback, useMemo } from "react";
import MapboxMap from "react-map-gl/mapbox";
import type { MapRef } from "react-map-gl/mapbox";
import { Source, Layer } from "react-map-gl/mapbox";
import type * as mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapWrapper, MapInner } from "./Map.styled";

const DEFAULT_VIEW_STATE = {
  longitude: -98.5795,
  latitude: 39.8283,
  zoom: 3
};

const USER_LOCATION_ZOOM = 17;

const ROUTE_LINE_SOURCE_ID = "route-line";
const ROUTE_POINTS_SOURCE_ID = "route-points";
const ROUTE_LINE_LAYER_ID = "route-line-layer";
const ROUTE_POINTS_LAYER_ID = "route-points-layer";

/** A point on the map (WGS84). Managed by the parent for use with distance display, delete, etc. */
export interface MapPoint {
  longitude: number;
  latitude: number;
}

export interface MapProps {
  /** When false, pan and zoom are disabled (pointer-events: none). */
  interactive?: boolean;
  /** Mapbox access token. Falls back to VITE_MAPBOX_ACCESS_TOKEN. */
  mapboxAccessToken?: string;
  /** Initial map view (used when zoomToUserLocation is false or before location is available). */
  initialViewState?: Partial<typeof DEFAULT_VIEW_STATE>;
  /** When true (default), request user location and zoom the map to it once available. */
  zoomToUserLocation?: boolean;
  /** Ordered points to display; a line is drawn between consecutive points. Managed by the parent. */
  points?: MapPoint[];
  /** Called when the map is clicked with the clicked location. Use to add points. */
  onMapClick?: (point: MapPoint) => void;
  /** Optional CSS height (e.g. "400px"). Defaults to 100% of wrapper min-height. */
  height?: string;
  /** Optional class name for the wrapper. */
  className?: string;
}

const Map: React.FC<MapProps> = ({
  interactive = true,
  mapboxAccessToken,
  initialViewState = DEFAULT_VIEW_STATE,
  zoomToUserLocation = true,
  points = [],
  onMapClick,
  height = "70vh",
  className
}) => {
  const token =
    mapboxAccessToken ?? import.meta.env.VITE_MAPBOX_ACCESS_TOKEN ?? "";
  const mapRef = useRef<MapRef>(null);
  const [userLocation, setUserLocation] = useState<{
    lng: number;
    lat: number;
  } | null>(null);

  useEffect(() => {
    if (!zoomToUserLocation || !navigator?.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lng: pos.coords.longitude,
          lat: pos.coords.latitude
        });
      },
      () => {},
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, [zoomToUserLocation]);

  const flyToUserLocation = useCallback(() => {
    if (!userLocation) return;
    const map = mapRef.current?.getMap?.();
    if (map) {
      map.flyTo({
        center: [userLocation.lng, userLocation.lat],
        zoom: USER_LOCATION_ZOOM,
        duration: 1500
      });
    }
  }, [userLocation]);

  const handleMapLoad = useCallback(() => {
    if (userLocation) flyToUserLocation();
  }, [userLocation, flyToUserLocation]);

  useEffect(() => {
    if (userLocation && mapRef.current) flyToUserLocation();
  }, [userLocation, flyToUserLocation]);

  const lineCoordinates = useMemo(
    () => points.map((p) => [p.longitude, p.latitude] as [number, number]),
    [points]
  );

  const lineGeoJSON = useMemo(
    () => ({
      type: "Feature" as const,
      properties: {},
      geometry: {
        type: "LineString" as const,
        coordinates: lineCoordinates
      }
    }),
    [lineCoordinates]
  );

  const pointsGeoJSON = useMemo(
    () => ({
      type: "FeatureCollection" as const,
      features: points.map((p) => ({
        type: "Feature" as const,
        properties: {},
        geometry: {
          type: "Point" as const,
          coordinates: [p.longitude, p.latitude] as [number, number]
        }
      }))
    }),
    [points]
  );

  const showLine = points.length >= 2;
  const showPoints = points.length >= 1;

  const handleClick = useCallback(
    (e: mapboxgl.MapMouseEvent) => {
      onMapClick?.({
        longitude: e.lngLat.lng,
        latitude: e.lngLat.lat
      });
    },
    [onMapClick]
  );

  if (!token) {
    return (
      <MapWrapper className={className} style={height ? { height } : undefined}>
        <MapInner $interactive={false} data-testid="map-placeholder">
          <div
            style={{
              width: "100%",
              height: "100%",
              minHeight: "300px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#6b6b6b",
              fontSize: "0.875rem"
            }}
          >
            Set VITE_MAPBOX_ACCESS_TOKEN or pass mapboxAccessToken to display the map.
          </div>
        </MapInner>
      </MapWrapper>
    );
  }

  return (
    <MapWrapper className={className} style={height ? { height } : undefined}>
      <MapInner $interactive={interactive}>
        <MapboxMap
          ref={mapRef}
          mapboxAccessToken={token}
          initialViewState={initialViewState}
          onLoad={handleMapLoad}
          onClick={onMapClick ? handleClick : undefined}
          style={{ width: "100%", height: "100%", minHeight: "300px" }}
          mapStyle="mapbox://styles/mapbox/light-v11"
        >
          {showLine && (
            <Source id={ROUTE_LINE_SOURCE_ID} type="geojson" data={lineGeoJSON}>
              <Layer
                id={ROUTE_LINE_LAYER_ID}
                type="line"
                paint={
                  {
                    "line-color": "#1a1a1a",
                    "line-width": 3,
                    "line-join": "round",
                    "line-cap": "round"
                  } as mapboxgl.LineLayerSpecification["paint"]
                }
              />
            </Source>
          )}
          {showPoints && (
            <Source id={ROUTE_POINTS_SOURCE_ID} type="geojson" data={pointsGeoJSON}>
              <Layer
                id={ROUTE_POINTS_LAYER_ID}
                type="circle"
                paint={
                  {
                    "circle-radius": 6,
                    "circle-color": "#1a1a1a",
                    "circle-stroke-width": 2,
                    "circle-stroke-color": "#ffffff"
                  } as mapboxgl.CircleLayerSpecification["paint"]
                }
              />
            </Source>
          )}
        </MapboxMap>
      </MapInner>
    </MapWrapper>
  );
};

export default Map;
