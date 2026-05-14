import React from "react";
import InputAction from "@/ui/InputAction";
import CalculatorPage, {
  ControlsPanel,
  QuickValueButton,
  QuickValueGrid
} from "@/features/projects/components/CalculatorPage";
import ReceiptPreview from "./ReceiptPreview";
import type { Project } from "@/features/projects/projects";
import { currencyFormatter, formatPercentage, QUICK_TIP_PERCENTAGES } from "./tipCalculator.utils";
import { useTipCalculator } from "./useTipCalculator";

interface TipCalculatorPageProps {
  project: Project;
}

const TipCalculatorPage: React.FC<TipCalculatorPageProps> = ({ project }) => {
  const { billTotal, totals, setBillTotal, setTipPercentage } = useTipCalculator();

  return (
    <CalculatorPage
      title={project.title}
      description={project.description}
      controls={
        <ControlsPanel padding="md" variant="secondary" shadow="mdDown">
          <InputAction
            label="Bill total"
            value={billTotal}
            onChange={(e) => setBillTotal(e.target.value)}
            placeholder="0.00"
          />
          <QuickValueGrid aria-label="Quick tip percentages">
            {QUICK_TIP_PERCENTAGES.map((percentage) => (
              <QuickValueButton
                key={percentage}
                type="button"
                onClick={() => setTipPercentage(String(percentage))}
                $active={totals.tipPercentage === percentage}
              >
                {percentage}%
              </QuickValueButton>
            ))}
          </QuickValueGrid>
        </ControlsPanel>
      }
    >
      <ReceiptPreview
        title="Tip Receipt"
        meta="Table 02"
        lines={[
          {
            label: "Bill total",
            value: currencyFormatter.format(totals.subtotal)
          },
          {
            label: `Tip (${formatPercentage(totals.tipPercentage)}%)`,
            value: currencyFormatter.format(totals.tip)
          }
        ]}
        totalLabel="Total"
        totalValue={currencyFormatter.format(totals.total)}
        footer="Suggested gratuity calculated from the bill total."
      />
    </CalculatorPage>
  );
};

export default TipCalculatorPage;
