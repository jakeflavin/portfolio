import { useMemo, useState } from "react";
import type { MapPoint } from "./Map";
import { totalDistanceMiles } from "./runningRouteEstimator.utils";

export function useRunningRouteEstimator() {
  const [points, setPoints] = useState<MapPoint[]>([]);
  const totalMiles = useMemo(() => totalDistanceMiles(points), [points]);

  return {
    points,
    totalMiles,
    addPoint: (point: MapPoint) => setPoints((prev) => [...prev, point]),
    clearPoints: () => setPoints([]),
    removeLastPoint: () => setPoints((prev) => prev.slice(0, -1))
  };
}
