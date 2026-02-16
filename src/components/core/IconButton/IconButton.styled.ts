import styled from "styled-components";

export const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius};

  background: transparent;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.primary};

  line-height: 0;
  transition: background-color 0.2s ease, color 0.2s ease, transform 0.15s ease;

  &:hover {
    background-color:  ${({ theme }) => `${theme.colors.primary}18`};
    color: ${({ theme }) => theme.colors.primary};
  }

  &:active {
    transform: scale(0.96);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme}) => theme.colors.primary};
    outline-offset: 2px;
  }
`;