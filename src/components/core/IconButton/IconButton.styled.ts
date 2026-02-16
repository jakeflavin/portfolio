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

  line-height: 0;
  transition: background-color 0.2s ease, transform 0.15s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.12);
  }

  &:active {
    transform: scale(0.96);
  }

  &:focus-visible {
    outline: 2px solid rgba(255, 255, 255, 0.8);
    outline-offset: 2px;
  }
`;