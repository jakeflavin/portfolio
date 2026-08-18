import styled from "styled-components";

export const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 7px;
  border-radius: ${({ theme }) => theme.radii?.pill ?? "999px"};

  background: transparent;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.primary};

  line-height: 0;
  transition: background-color ${({ theme }) => theme.motion?.duration?.fast ?? "0.2s"} ${({ theme }) => theme.motion?.easing ?? "ease"},
    color ${({ theme }) => theme.motion?.duration?.fast ?? "0.2s"} ${({ theme }) => theme.motion?.easing ?? "ease"},
    transform ${({ theme }) => theme.motion?.duration?.fast ?? "0.2s"} ${({ theme }) => theme.motion?.easing ?? "ease"};

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
    color: ${({ theme }) => theme.colors.primary};
  }

  &:active {
    transform: scale(0.96);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.focusBorder};
    outline-offset: 2px;
  }
`;