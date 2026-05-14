import { useMemo, useState } from "react";
import {
  calculatePaceResult,
  getProjectedRows,
  sanitizeDistanceInput,
  sanitizeTimeInput,
  type DistanceUnit
} from "./runPaceCalculator.utils";

export function useRunPaceCalculator() {
  const [distance, setDistanceValue] = useState("6.21");
  const [unit, setUnit] = useState<DistanceUnit>("mi");
  const [time, setTimeValue] = useState("50:00");
  const [pace, setPaceValue] = useState("");

  const result = useMemo(
    () => calculatePaceResult(distance, time, pace),
    [distance, time, pace]
  );
  const projectedRows = useMemo(
    () => getProjectedRows(result.paceSeconds, unit),
    [result.paceSeconds, unit]
  );

  return {
    distance,
    unit,
    time,
    pace,
    result,
    projectedRows,
    setDistance: (value: string) => setDistanceValue(sanitizeDistanceInput(value)),
    setUnit,
    setTime: (value: string) => setTimeValue(sanitizeTimeInput(value)),
    setPace: (value: string) => setPaceValue(sanitizeTimeInput(value))
  };
}
