import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  body {
    margin: 0;
    min-height: 100vh;
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    background: ${({ theme }) => theme.bodyBackground ?? theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    transition: background ${({ theme }) => theme.motion?.duration?.slow ?? "0.4s"} ${({ theme }) => theme.motion?.easing ?? "ease"},
      color ${({ theme }) => theme.motion?.duration?.slow ?? "0.4s"} ${({ theme }) => theme.motion?.easing ?? "ease"};
  }

  body::before {
    content: "";
    position: fixed;
    inset: 0;
    background-image: url("/noise.png");
    opacity: 0.03;
    pointer-events: none;
    z-index: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    body,
    body * {
      transition-duration: 0.01ms !important;
    }
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
  }

  *, *::before, *::after {
    box-sizing: border-box;
  }
`;