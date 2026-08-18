import styled from "styled-components";

interface CardWrapperProps {
  $disabled?: boolean;
}

export const CardWrapper = styled.a<CardWrapperProps>`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 0;
  color: inherit;
  text-decoration: none;
  padding: ${({ theme }) => theme.spacing.md};
  gap: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  overflow: hidden;
  cursor: pointer;
  transition: border-color ${({ theme }) => theme.motion?.duration?.normal ?? "0.15s"} ${({ theme }) => theme.motion?.easing ?? "ease"},
    background ${({ theme }) => theme.motion?.duration?.normal ?? "0.15s"} ${({ theme }) => theme.motion?.easing ?? "ease"};

  &:hover {
    background: ${({ theme }) => theme.colors.secondary};
  }

  &:focus-visible {
    outline: none;
    border-color: ${({ theme }) => theme.colors.focusBorder};
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }

  ${({ $disabled }) =>
    $disabled &&
    `
    cursor: default;
    opacity: 0.45;

    &:hover {
      background: inherit;
    }
  `}
`;

export const ImageContainer = styled.div`
  width: 100%;
  aspect-ratio: 16 / 10;
  border-radius: calc(${({ theme }) => theme.borderRadius} - 8px);
  overflow: hidden;
  background: ${({ theme }) => theme.colors.secondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  filter: ${({ theme }) => theme.img.brightness};
`;

export const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs} 2px 0;
`;

export const CardTypeLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.size?.xs ?? "0.6875rem"};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${({ theme }) => theme.colors.muted};
  font-weight: 600;
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
  font-size: ${({ theme }) => theme.typography.card?.titleSize ?? "1rem"};
  line-height: 1.3;
  font-weight: 600;
  letter-spacing: ${({ theme }) => theme.typography.card?.titleTracking ?? "-0.01em"};
  text-transform: ${({ theme }) => theme.typography.card?.titleTransform ?? "none"};
  font-family: ${({ theme }) => theme.typography.fontFamily.heading};
  color: ${({ theme }) => theme.colors.text};
`;

export const Description = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.size?.md ?? "0.875rem"};
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
  font-size: ${({ theme }) => theme.typography.size?.sm ?? "0.75rem"};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.muted};
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 999px;
  padding: 3px 10px;
`;
