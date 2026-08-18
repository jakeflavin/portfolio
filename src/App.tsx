import React, { useEffect, useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import { blueprintTheme, blueprintDarkTheme } from "./styles/themes";
import { GlobalStyles } from "./styles/globalStyles";
import FooterBar from "@/features/layout/FooterBar";
import NavBar from "@/features/layout/NavBar";
import Home from "@/features/home/Home";

/** Every app shares one origin now, so storage keys are namespaced. */
const THEME_KEY = "portfolio.theme";

/** Returns whether the user's OS preference is dark mode. */
const getPrefersDark = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;

/** A stored choice wins over the OS preference; otherwise fall back to the OS. */
const getInitialDarkMode = () => {
  if (typeof window === "undefined") return false;
  const stored = window.localStorage.getItem(THEME_KEY);
  if (stored === "dark") return true;
  if (stored === "light") return false;
  return getPrefersDark();
};

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(getInitialDarkMode);
  const theme = isDarkMode ? blueprintDarkTheme : blueprintTheme;

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      // Only follow the OS while the user has not made a choice of their own.
      if (window.localStorage.getItem(THEME_KEY) === null) setIsDarkMode(e.matches);
    };
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  const toggleDarkMode = () =>
    setIsDarkMode((previous) => {
      const next = !previous;
      window.localStorage.setItem(THEME_KEY, next ? "dark" : "light");
      return next;
    });

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Container>
        <NavBar
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
        />
        <Content>
          <Home />
        </Content>
        <FooterBar />
      </Container>
    </ThemeProvider>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 95%;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  align-items: stretch;
  border-radius: ${({ theme }) => theme.borderRadius};
  margin: ${({ theme }) => theme.spacing.lg} auto;

  ${({ theme }) => theme.media.sm} {
    width: 90%;
  }

  ${({ theme }) => theme.media.md} {
    width: 80%;
  }

  ${({ theme }) => theme.media.lg} {
    width: 70%;
  }
`;

const Content = styled.div`
  min-height: 75vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export default App;
