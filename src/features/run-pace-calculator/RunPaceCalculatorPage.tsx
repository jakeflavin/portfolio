import React from "react";
import InputAction from "@/ui/InputAction";
import Select from "@/ui/Select";
import CalculatorPage, {
  Badge,
  ControlsPanel,
  DataTable,
  FieldRow,
  SelectSlot,
  TableHeader,
  TablePanel,
  TableTitle
} from "@/features/projects/components/CalculatorPage";
import type { Project } from "@/features/projects/projects";
import { formatTime, UNIT_OPTIONS, type DistanceUnit } from "./runPaceCalculator.utils";
import { useRunPaceCalculator } from "./useRunPaceCalculator";

interface RunPaceCalculatorPageProps {
  project: Project;
}

const RunPaceCalculatorPage: React.FC<RunPaceCalculatorPageProps> = ({ project }) => {
  const { distance, unit, time, result, projectedRows, setDistance, setUnit, setTime } =
    useRunPaceCalculator();
  const unitLabel = unit === "km" ? "km" : "mi";

  return (
    <CalculatorPage
      title={project.title}
      description={project.description}
      controls={
        <ControlsPanel padding="md" variant="secondary" shadow="mdDown">
          <FieldRow>
            <InputAction
              label="Distance"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
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
            onChange={(e) => setTime(e.target.value)}
            placeholder="50:00"
          />
        </ControlsPanel>
      }
    >
      <TablePanel padding="lg" variant="surface" shadow="md">
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
