import React, { useMemo, useState } from "react";
import InputAction from "@/ui/InputAction";
import CalculatorPage, {
  ControlsPanel,
  QuickValueButton,
  QuickValueGrid
} from "@/features/projects/components/CalculatorPage";
import ReceiptPreview from "./ReceiptPreview";
import type { Project } from "@/features/projects/projects";

interface TipCalculatorPageProps {
  project: Project;
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

function sanitizeMoneyInput(value: string): string {
  const cleaned = value.replace(/[^\d.]/g, "");
  const [whole = "", ...decimalParts] = cleaned.split(".");
  const decimal = decimalParts.join("").slice(0, 2);
  return decimalParts.length > 0 ? `${whole}.${decimal}` : whole;
}

function sanitizePercentInput(value: string): string {
  const cleaned = value.replace(/[^\d.]/g, "");
  const [whole = "", ...decimalParts] = cleaned.split(".");
  const decimal = decimalParts.join("").slice(0, 2);
  return decimalParts.length > 0 ? `${whole}.${decimal}` : whole;
}

function parseAmount(value: string): number {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

const TipCalculatorPage: React.FC<TipCalculatorPageProps> = ({ project }) => {
  const [billTotal, setBillTotal] = useState("48.75");
  const [tipPercentage, setTipPercentage] = useState("20");

  const totals = useMemo(() => {
    const subtotal = parseAmount(billTotal);
    const tipRate = parseAmount(tipPercentage) / 100;
    const tip = subtotal * tipRate;
    return {
      subtotal,
      tip,
      total: subtotal + tip,
      tipPercentage: parseAmount(tipPercentage)
    };
  }, [billTotal, tipPercentage]);

  return (
    <CalculatorPage
      title={project.title}
      description={project.description}
      controls={
        <ControlsPanel>
          <InputAction
            label="Bill total"
            value={billTotal}
            onChange={(e) => setBillTotal(sanitizeMoneyInput(e.target.value))}
            placeholder="0.00"
          />
          <QuickValueGrid aria-label="Quick tip percentages">
            {[15, 18, 20, 22].map((percentage) => (
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
            label: `Tip (${totals.tipPercentage.toFixed(totals.tipPercentage % 1 ? 2 : 0)}%)`,
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
