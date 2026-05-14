import styled from "styled-components";

interface CardWrapperProps {
  $columnSpan?: number;
}

export const CardWrapper = styled.div<CardWrapperProps>`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 0;
  grid-column: span ${({ $columnSpan = 1 }) => $columnSpan};
  padding: ${({ theme }) => theme.spacing.md};
  gap: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.surfaceGlass ?? theme.colors.surface};
  backdrop-filter: blur(20px) saturate(140%);
  -webkit-backdrop-filter: blur(20px) saturate(140%);
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  overflow: hidden;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.md};
  transition: border-color ${({ theme }) => theme.motion?.duration?.normal ?? "0.3s"} ${({ theme }) => theme.motion?.easing ?? "ease"},
    box-shadow ${({ theme }) => theme.motion?.duration?.normal ?? "0.3s"} ${({ theme }) => theme.motion?.easing ?? "ease"},
    transform ${({ theme }) => theme.motion?.duration?.normal ?? "0.3s"} ${({ theme }) => theme.motion?.easing ?? "ease"},
    background ${({ theme }) => theme.motion?.duration?.normal ?? "0.3s"} ${({ theme }) => theme.motion?.easing ?? "ease"};

  &:hover {
    transform: translateY(-3px);
    box-shadow: ${({ theme }) => theme.shadows.mdDown};
    border-color: color-mix(in srgb, ${({ theme }) => theme.colors.primary} 20%, ${({ theme }) => theme.colors.border});
  }

  &:hover img {
    transform: scale(1.03);
  }

  &:focus-visible {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }
`;

export const ImageContainer = styled.div`
  width: 100%;
  aspect-ratio: 16 / 10;
  border-radius: calc(${({ theme }) => theme.borderRadius} - 6px);
  overflow: hidden;
  background: color-mix(in srgb, ${({ theme }) => theme.colors.primary} 5%, ${({ theme }) => theme.colors.surface});
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  filter: ${({ theme }) => theme.img.brightness};
  transition: transform 0.6s ${({ theme }) => theme.motion?.easing ?? "ease"},
    filter ${({ theme }) => theme.motion?.duration?.normal ?? "0.3s"} ${({ theme }) => theme.motion?.easing ?? "ease"};
`;

export const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.xs};
`;

export const CardTypeLabel = styled.div`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${({ theme }) => theme.colors.accent};
  font-weight: 500;
  font-family: ${({ theme }) => theme.typography.fontFamily.heading};
`;

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const Title = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.card?.titleSize ?? "1.25rem"};
  line-height: 1.2;
  font-weight: ${({ theme }) => theme.typography.heading?.weight ?? 700};
  letter-spacing: ${({ theme }) => theme.typography.card?.titleTracking ?? "-0.025em"};
  text-transform: ${({ theme }) => theme.typography.card?.titleTransform ?? "none"};
  font-family: ${({ theme }) => theme.typography.fontFamily.heading};
  color: ${({ theme }) => theme.colors.text};
`;

export const Description = styled.p`
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.muted};
  text-wrap: pretty;
`;

export const TagsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

export const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.01em;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.secondaryGlass};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 999px;
  padding: 3px 10px;
`;
