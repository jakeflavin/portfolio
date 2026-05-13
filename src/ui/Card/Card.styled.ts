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
  padding: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.surfaceGlass ?? theme.colors.surface};
  backdrop-filter: blur(${({ theme }) => theme.blur?.md ?? "16px"});
  -webkit-backdrop-filter: blur(${({ theme }) => theme.blur?.md ?? "16px"});
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  overflow: hidden;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.md};
  transition: border-color ${({ theme }) => theme.motion?.duration?.normal ?? "0.3s"} ${({ theme }) => theme.motion?.easing ?? "ease"},
    box-shadow ${({ theme }) => theme.motion?.duration?.normal ?? "0.3s"} ${({ theme }) => theme.motion?.easing ?? "ease"},
    transform ${({ theme }) => theme.motion?.duration?.fast ?? "0.2s"} ${({ theme }) => theme.motion?.easing ?? "ease"};

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.mdDown};
  }

  &:focus-visible {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }
`;

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.xs};
`;

export const Title = styled.h3`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  font-family: ${({ theme }) => theme.typography.fontFamily.heading};
  color: ${({ theme }) => theme.colors.text};
`;

export const ImageContainer = styled.div`
  width: 100%;
  border-radius: ${({ theme }) => theme.borderRadius};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.secondaryGlass ?? theme.colors.secondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

/* UPDATED: image no longer handles spacing or radius */
export const CardImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
  border-radius: inherit;
  filter: ${({theme}) => theme.img.brightness};
`;

export const Description = styled.p`
  margin: 0;
  padding: ${({ theme }) => theme.spacing.xs};
  font-size: 0.875rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.muted};
`;

export const TagsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs};
`;

export const Tag = styled.span`
  display: inline-block;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  color: ${({ theme }) => theme.colors.inverseText};
  background: ${({ theme }) => theme.colors.primary};
  border-radius: 999px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;