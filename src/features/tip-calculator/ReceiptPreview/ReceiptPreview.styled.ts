import styled from "styled-components";
import Surface from "@/ui/Surface";

export const ReceiptSurface = styled(Surface)`
  width: 100%;
  display: flex;
  justify-content: center;
`;

export const Receipt = styled.div`
  width: min(100%, 420px);
  color: ${({ theme }) => theme.colors.paperText};
  background:
    linear-gradient(
      135deg,
      color-mix(in srgb, ${({ theme }) => theme.colors.paper} 88%, ${({ theme }) => theme.colors.surface}),
      ${({ theme }) => theme.colors.paper}
    ),
    repeating-linear-gradient(
      0deg,
      color-mix(in srgb, ${({ theme }) => theme.colors.paperBorder} 18%, transparent) 0 1px,
      transparent 1px 22px
    );
  border: 1px solid ${({ theme }) => theme.colors.paperBorder};
  border-bottom: 0;
  border-radius: ${({ theme }) => theme.borderRadius} ${({ theme }) => theme.borderRadius} 0 0;
  padding: ${({ theme }) => theme.spacing.lg};
  padding-bottom: calc(${({ theme }) => theme.spacing.lg} + 12px);
  box-shadow: ${({ theme }) => theme.shadows.md};
  position: relative;
  overflow: hidden;
  filter: drop-shadow(0 1px 0 ${({ theme }) => theme.colors.paperBorder})
    drop-shadow(0 4px 10px ${({ theme }) => theme.colors.border});
  clip-path: polygon(
    0 0,
    100% 0,
    100% calc(100% - 12px),
    calc(100% - 9px) 100%,
    calc(100% - 18px) calc(100% - 12px),
    calc(100% - 27px) 100%,
    calc(100% - 36px) calc(100% - 12px),
    calc(100% - 45px) 100%,
    calc(100% - 54px) calc(100% - 12px),
    calc(100% - 63px) 100%,
    calc(100% - 72px) calc(100% - 12px),
    calc(100% - 81px) 100%,
    calc(100% - 90px) calc(100% - 12px),
    calc(100% - 99px) 100%,
    calc(100% - 108px) calc(100% - 12px),
    calc(100% - 117px) 100%,
    calc(100% - 126px) calc(100% - 12px),
    calc(100% - 135px) 100%,
    calc(100% - 144px) calc(100% - 12px),
    calc(100% - 153px) 100%,
    calc(100% - 162px) calc(100% - 12px),
    calc(100% - 171px) 100%,
    calc(100% - 180px) calc(100% - 12px),
    calc(100% - 189px) 100%,
    calc(100% - 198px) calc(100% - 12px),
    calc(100% - 207px) 100%,
    calc(100% - 216px) calc(100% - 12px),
    calc(100% - 225px) 100%,
    calc(100% - 234px) calc(100% - 12px),
    calc(100% - 243px) 100%,
    calc(100% - 252px) calc(100% - 12px),
    calc(100% - 261px) 100%,
    calc(100% - 270px) calc(100% - 12px),
    calc(100% - 279px) 100%,
    calc(100% - 288px) calc(100% - 12px),
    calc(100% - 297px) 100%,
    calc(100% - 306px) calc(100% - 12px),
    calc(100% - 315px) 100%,
    calc(100% - 324px) calc(100% - 12px),
    calc(100% - 333px) 100%,
    calc(100% - 342px) calc(100% - 12px),
    calc(100% - 351px) 100%,
    calc(100% - 360px) calc(100% - 12px),
    calc(100% - 369px) 100%,
    calc(100% - 378px) calc(100% - 12px),
    calc(100% - 387px) 100%,
    calc(100% - 396px) calc(100% - 12px),
    calc(100% - 405px) 100%,
    calc(100% - 414px) calc(100% - 12px),
    calc(100% - 423px) 100%,
    0 calc(100% - 12px)
  );
`;

export const ReceiptHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const ReceiptTitle = styled.h2`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.fontFamily.heading};
  font-size: 1.75rem;
  line-height: 1.1;
  color: ${({ theme }) => theme.colors.paperText};
`;

export const ReceiptMeta = styled.span`
  color: ${({ theme }) => theme.colors.paperMuted};
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
`;

export const Divider = styled.hr`
  border: 0;
  border-top: 1px dashed ${({ theme }) => theme.colors.paperBorder};
  margin: ${({ theme }) => theme.spacing.lg} 0;
`;

export const ReceiptRows = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const ReceiptRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  font-size: 1rem;

  span {
    color: ${({ theme }) => theme.colors.paperMuted};
  }

  strong {
    color: ${({ theme }) => theme.colors.paperText};
    font-variant-numeric: tabular-nums;
  }
`;

export const TotalRow = styled(ReceiptRow)`
  align-items: baseline;
  font-size: 1.35rem;

  span,
  strong {
    color: ${({ theme }) => theme.colors.paperText};
  }
`;

export const ReceiptFooter = styled.p`
  margin: ${({ theme }) => theme.spacing.lg} 0 0;
  color: ${({ theme }) => theme.colors.paperMuted};
  font-size: 0.875rem;
  line-height: 1.5;
`;
