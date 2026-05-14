import React from "react";
import {
  Divider,
  Receipt,
  ReceiptFooter,
  ReceiptHeader,
  ReceiptMeta,
  ReceiptRow,
  ReceiptRows,
  ReceiptSurface,
  ReceiptTitle,
  TotalRow
} from "./ReceiptPreview.styled";

export interface ReceiptPreviewLine {
  label: string;
  value: string;
}

export interface ReceiptPreviewProps {
  title: string;
  meta?: string;
  lines: ReceiptPreviewLine[];
  totalLabel: string;
  totalValue: string;
  footer?: string;
}

const ReceiptPreview: React.FC<ReceiptPreviewProps> = ({
  title,
  meta,
  lines,
  totalLabel,
  totalValue,
  footer
}) => (
  <ReceiptSurface padding="lg" variant="surface" shadow="md">
    <Receipt>
      <ReceiptHeader>
        <ReceiptTitle>{title}</ReceiptTitle>
        {meta && <ReceiptMeta>{meta}</ReceiptMeta>}
      </ReceiptHeader>
      <Divider />
      <ReceiptRows>
        {lines.map((line) => (
          <ReceiptRow key={line.label}>
            <span>{line.label}</span>
            <strong>{line.value}</strong>
          </ReceiptRow>
        ))}
      </ReceiptRows>
      <Divider />
      <TotalRow>
        <span>{totalLabel}</span>
        <strong>{totalValue}</strong>
      </TotalRow>
      {footer && <ReceiptFooter>{footer}</ReceiptFooter>}
    </Receipt>
  </ReceiptSurface>
);

export default ReceiptPreview;
