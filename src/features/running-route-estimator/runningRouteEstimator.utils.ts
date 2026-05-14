import type { MapPoint } from "./Map";

const EARTH_RADIUS_MILES = 3959;

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function distanceMiles(a: MapPoint, b: MapPoint): number {
  const dLat = toRadians(b.latitude - a.latitude);
  const dLon = toRadians(b.longitude - a.longitude);
  const lat1 = toRadians(a.latitude);
  const lat2 = toRadians(b.latitude);
  const haversine =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

  return 2 * EARTH_RADIUS_MILES * Math.asin(Math.sqrt(haversine));
}

export function totalDistanceMiles(points: MapPoint[]): number {
  if (points.length < 2) return 0;

  let total = 0;
  for (let index = 1; index < points.length; index++) {
    total += distanceMiles(points[index - 1], points[index]);
  }

  return total;
}
