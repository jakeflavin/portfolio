import styled from "styled-components";

export const HeroContainer = styled.header`
  background-color: ${({ theme }) => theme.colors.secondaryGlass ?? theme.colors.secondary};
  backdrop-filter: blur(${({ theme }) => theme.blur?.lg ?? "24px"});
  -webkit-backdrop-filter: blur(${({ theme }) => theme.blur?.lg ?? "24px"});
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.md};
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.md};

  ${({ theme }) => theme.media.md} {
    padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg};
  }
`;

export const Name = styled.h1`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.fontFamily.heading};
  font-size: ${({ theme }) => theme.typography.size?.xl ?? "1.5rem"};
  font-weight: ${({ theme }) => theme.typography.heading.weight};
  letter-spacing: ${({ theme }) => theme.typography.heading.tracking};
  text-transform: ${({ theme }) => theme.typography.heading.transform};
  color: ${({ theme }) => theme.colors.text};
`;

export const Tagline = styled.div`
  display: flex;
  align-items: baseline;
  gap: ${({ theme }) => theme.spacing.sm};
  min-height: 2.25em;
`;

/** A terminal prompt marker — it sits with the blueprint theme's monospace identity. */
export const Prompt = styled.span`
  color: ${({ theme }) => theme.colors.accent};
  font-family: ${({ theme }) => theme.typography.fontFamily.heading};
  font-size: ${({ theme }) => theme.typography.size?.lg ?? "1rem"};
  user-select: none;
`;

export const Blurb = styled.p`
  margin: 0;
  max-width: 60ch;
  font-size: ${({ theme }) => theme.typography.size?.md ?? "0.875rem"};
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.muted};
  text-wrap: pretty;
`;
