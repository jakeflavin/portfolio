import styled from "styled-components";

/**
 * The wordmark carries the Instagram gradient, which is the closest thing the app has to
 * a brand colour. Clipped to the text, as the logo is.
 */
export const Wordmark = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily.heading};
  font-size: ${({ theme }) => theme.typography.size?.xl ?? "1.25rem"};
  font-weight: ${({ theme }) => theme.typography.weight?.bold ?? 700};
  letter-spacing: -0.02em;
  white-space: nowrap;

  background: ${({ theme }) => theme.gradient?.brand ?? "none"};
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;

  /* A flat fallback where background-clip: text is unsupported. */
  @supports not ((background-clip: text) or (-webkit-background-clip: text)) {
    background: none;
    color: ${({ theme }) => theme.colors.text};
    -webkit-text-fill-color: currentColor;
  }
`;

export const IconGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-left: auto;
`;
