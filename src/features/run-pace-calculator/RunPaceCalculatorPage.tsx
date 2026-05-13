import React, { useMemo, useState } from "react";
import InputAction from "@/ui/InputAction";
import Select from "@/ui/Select";
import CalculatorPage, {
  Badge,
  ControlsPanel,
  DataTable,
  FieldRow,
  SelectSlot,
  SummaryMessage,
  SummaryPanel,
  SummaryRow,
  TableHeader,
  TablePanel,
  TableTitle
} from "@/features/projects/components/CalculatorPage";
import type { Project } from "@/features/projects/projects";

interface RunPaceCalculatorPageProps {
  project: Project;
}

const RACE_DISTANCES = [
  { name: "1 Mile", miles: 1 },
  { name: "5K", miles: 3.10686 },
  { name: "10K", miles: 6.21371 },
  { name: "10 Mile", miles: 10 },
  { name: "Half Marathon", miles: 13.1094 },
  { name: "Marathon", miles: 26.2188 },
  { name: "50K", miles: 31.0686 }
];

const UNIT_OPTIONS = [
  { value: "mi", label: "Miles" },
  { value: "km", label: "Kilometers" }
] as const;

type DistanceUnit = (typeof UNIT_OPTIONS)[number]["value"];

const MILES_TO_KILOMETERS = 1.60934;

function sanitizeDistanceInput(value: string): string {
  const cleaned = value.replace(/[^\d.]/g, "");
  const [whole = "", ...decimalParts] = cleaned.split(".");
  const decimal = decimalParts.join("").slice(0, 2);
  return decimalParts.length > 0 ? `${whole}.${decimal}` : whole;
}

function sanitizeTimeInput(value: string): string {
  return value.replace(/[^\d:]/g, "").slice(0, 8);
}

function parseDistance(value: string): number | null {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function getRaceDistance(raceMiles: number, unit: DistanceUnit): number {
  return unit === "km" ? raceMiles * MILES_TO_KILOMETERS : raceMiles;
}

function parseClockTime(value: string): number | null {
  const parts = value.split(":").filter(Boolean).map(Number);
  if (parts.length === 0 || parts.length > 3 || parts.some((part) => !Number.isFinite(part))) {
    return null;
  }

  const [hours = 0, minutes = 0, seconds = 0] =
    parts.length === 3 ? parts : parts.length === 2 ? [0, parts[0], parts[1]] : [0, parts[0], 0];

  if (minutes >= 60 || seconds >= 60) return null;
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  return totalSeconds > 0 ? totalSeconds : null;
}

function formatTime(totalSeconds: number): string {
  const rounded = Math.round(totalSeconds);
  const hours = Math.floor(rounded / 3600);
  const minutes = Math.floor((rounded % 3600) / 60);
  const seconds = rounded % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

const RunPaceCalculatorPage: React.FC<RunPaceCalculatorPageProps> = ({ project }) => {
  const [distance, setDistance] = useState("6.21");
  const [unit, setUnit] = useState<DistanceUnit>("mi");
  const [time, setTime] = useState("50:00");
  const [pace, setPace] = useState("");
  const unitLabel = unit === "km" ? "km" : "mi";

  const result = useMemo(() => {
    const distanceUnits = parseDistance(distance);
    const timeSeconds = parseClockTime(time);
    const paceSeconds = parseClockTime(pace);
    const filledCount = [distanceUnits, timeSeconds, paceSeconds].filter(Boolean).length;

    if (filledCount < 2) {
      return {
        distanceUnits,
        timeSeconds,
        paceSeconds,
        message: "Enter any two values to calculate the third."
      };
    }

    if (!distanceUnits && timeSeconds && paceSeconds) {
      return {
        distanceUnits: timeSeconds / paceSeconds,
        timeSeconds,
        paceSeconds,
        message: "Distance calculated from time and pace."
      };
    }

    if (!timeSeconds && distanceUnits && paceSeconds) {
      return {
        distanceUnits,
        timeSeconds: distanceUnits * paceSeconds,
        paceSeconds,
        message: "Time calculated from distance and pace."
      };
    }

    if (!paceSeconds && distanceUnits && timeSeconds) {
      return {
        distanceUnits,
        timeSeconds,
        paceSeconds: timeSeconds / distanceUnits,
        message: "Pace calculated from distance and time."
      };
    }

    if (distanceUnits && timeSeconds) {
      return {
        distanceUnits,
        timeSeconds,
        paceSeconds: timeSeconds / distanceUnits,
        message: "Using distance and time for projections."
      };
    }

    return {
      distanceUnits,
      timeSeconds,
      paceSeconds,
      message: "Enter any two values to calculate the third."
    };
  }, [distance, time, pace]);

  const projectedRows = useMemo(
    () =>
      RACE_DISTANCES.map((race) => ({
        ...race,
        displayDistance: getRaceDistance(race.miles, unit),
        projectedTime: result.paceSeconds
          ? formatTime(getRaceDistance(race.miles, unit) * result.paceSeconds)
          : "Enter pace"
      })),
    [result.paceSeconds, unit]
  );

  return (
    <CalculatorPage
      title={project.title}
      description={project.description}
      controls={
        <ControlsPanel>
          <FieldRow>
            <InputAction
              label="Distance"
              value={distance}
              onChange={(e) => setDistance(sanitizeDistanceInput(e.target.value))}
              placeholder={unit === "km" ? "10.00" : "6.21"}
            />
            <SelectSlot>
              <Select
                options={[...UNIT_OPTIONS]}
                value={unit}
                onChange={(value) => setUnit(value as DistanceUnit)}
                aria-label="Distance unit"
                fullWidth
              />
            </SelectSlot>
          </FieldRow>
          <InputAction
            label="Time"
            value={time}
            onChange={(e) => setTime(sanitizeTimeInput(e.target.value))}
            placeholder="50:00"
          />
        </ControlsPanel>
      }
    >
      <TablePanel>
        <TableHeader>
          <TableTitle>Race Projections</TableTitle>
          <Badge>
            {result.paceSeconds ? `${formatTime(result.paceSeconds)} / ${unitLabel}` : "No pace yet"}
          </Badge>
        </TableHeader>
        <DataTable>
          <thead>
            <tr>
              <th>Race</th>
              <th>Distance</th>
              <th>Projected time</th>
            </tr>
          </thead>
          <tbody>
            {projectedRows.map((race) => (
              <tr key={race.name}>
                <td>{race.name}</td>
                <td>{race.displayDistance.toFixed(race.displayDistance % 1 ? 2 : 0)} {unitLabel}</td>
                <td>{race.projectedTime}</td>
              </tr>
            ))}
          </tbody>
        </DataTable>
      </TablePanel>
    </CalculatorPage>
  );
};

export default RunPaceCalculatorPage;
