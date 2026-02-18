import styled from "styled-components";

export const StyledLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font: inherit;
  font-size: 0.875rem;
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: underline;
  text-underline-offset: 2px;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

export const Favicon = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 4px;
  flex-shrink: 0;
  object-fit: contain;
`;

export const LinkText = styled.span`
  flex: 1;
  min-width: 0;
`;

export const LinkIcon = styled.span`
  display: inline-flex;
  flex-shrink: 0;
  color: currentColor;
`;
