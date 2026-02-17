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
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  overflow: hidden;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.md};
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
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
  font-weight: 65{({ theme }) => theme.typography.fontFamily.heading};
  color: ${({ theme }) => theme.colors.text};
`;

/* NEW: container that controls rounding + clipping */
export const ImageContainer = styled.div`
  width: 100%;
  border-radius: ${({ theme }) => theme.borderRadius};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.secondary};
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
  font-size: 0.65rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.tagText};
  background: ${({ theme }) => theme.colors.tagBackground};
  border-radius: ${({ theme }) => theme.borderRadius};
`;