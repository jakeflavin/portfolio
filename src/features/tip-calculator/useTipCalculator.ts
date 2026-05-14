import { useMemo, useState } from "react";
import {
  calculateTipTotals,
  sanitizeMoneyInput,
  sanitizePercentInput
} from "./tipCalculator.utils";

export function useTipCalculator() {
  const [billTotal, setBillTotalValue] = useState("48.75");
  const [tipPercentage, setTipPercentageValue] = useState("20");

  const totals = useMemo(
    () => calculateTipTotals(billTotal, tipPercentage),
    [billTotal, tipPercentage]
  );

  return {
    billTotal,
    tipPercentage,
    totals,
    setBillTotal: (value: string) => setBillTotalValue(sanitizeMoneyInput(value)),
    setTipPercentage: (value: string) => setTipPercentageValue(sanitizePercentInput(value))
  };
}
