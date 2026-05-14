import styled from "styled-components";
import Surface from "@/ui/Surface";

export const Layout = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md} 0;

  ${({ theme }) => theme.media.md} {
    grid-template-columns: minmax(0, 320px) 1fr;
  }
`;

export const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  min-width: 0;
`;

export const RightColumn = styled.div`
  min-width: 0;
  display: flex;
  align-items: flex-start;
`;

export const ControlsPanel = styled(Surface)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const FieldRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(7rem, 9rem);
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: stretch;
`;

export const SelectSlot = styled.div`
  width: 100%;
  min-width: 0;
`;

export const SummaryPanel = styled(Surface)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const SummaryRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};

  span {
    color: ${({ theme }) => theme.colors.muted};
  }

  strong {
    color: ${({ theme }) => theme.colors.text};
    font-variant-numeric: tabular-nums;
  }
`;

export const SummaryMessage = styled.p`
  margin: ${({ theme }) => theme.spacing.xs} 0 0;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.875rem;
  line-height: 1.5;
`;

export const QuickValueGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const QuickValueButton = styled.button<{ $active: boolean }>`
  min-width: 0;
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid
    ${({ $active, theme }) => ($active ? theme.colors.primary : theme.colors.border)};
  border-radius: ${({ theme }) => theme.borderRadius};
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.secondaryGlass ?? theme.colors.secondary};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.inverseText : theme.colors.text};
  font: inherit;
  font-weight: 700;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: background ${({ theme }) => theme.motion.duration.fast} ${({ theme }) => theme.motion.easing},
    border-color ${({ theme }) => theme.motion.duration.fast} ${({ theme }) => theme.motion.easing},
    color ${({ theme }) => theme.motion.duration.fast} ${({ theme }) => theme.motion.easing};

  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }
`;

export const TablePanel = styled(Surface)`
  width: 100%;
  overflow-x: auto;
`;

export const TableHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const TableTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.typography.fontFamily.heading};
  font-size: 1.35rem;
  line-height: 1.2;
`;

export const Badge = styled.span`
  flex-shrink: 0;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.inverseText};
  font-size: 0.8125rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
`;

export const DataTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 520px;

  th,
  td {
    padding: ${({ theme }) => theme.spacing.sm};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    text-align: left;
    white-space: nowrap;
  }

  th {
    color: ${({ theme }) => theme.colors.muted};
    font-size: 0.8125rem;
    font-weight: 700;
    text-transform: uppercase;
  }

  td {
    color: ${({ theme }) => theme.colors.text};
    font-variant-numeric: tabular-nums;
  }

  tr:last-child td {
    border-bottom: 0;
  }
`;
