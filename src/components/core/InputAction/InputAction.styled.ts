import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  gap: ${({ theme }) => theme.spacing.sm};

  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);

  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
`;

export const Input = styled.input`
  flex: 1;
  min-width: 0;

  padding: ${({ theme }) => theme.spacing.sm} 0;
  margin: 0;

  font: inherit;
  font-size: 1rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.text};
  background: transparent;
  border: none;
  outline: none;

  &::placeholder {
    color: ${({ theme }) => theme.colors.text};
    opacity: 0.5;
  }
`;

export const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius};

  background: transparent;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.primary};

  line-height: 0;
  transition: background-color 0.2s ease, color 0.2s ease, transform 0.15s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary}18;
    color: ${({ theme }) => theme.colors.primary};
  }

  &:active {
    transform: scale(0.96);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;
