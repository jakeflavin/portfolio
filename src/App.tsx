import React, { useEffect, useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import { blueprintTheme, blueprintDarkTheme } from "./styles/themes";
import { GlobalStyles } from "./styles/globalStyles";
import FooterBar from "@/features/layout/FooterBar";
import NavBar from "@/features/layout/NavBar";
import Home from "@/features/home/Home";

/** Returns whether the user's OS preference is dark mode. */
const getPrefersDark = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(getPrefersDark);
  const theme = isDarkMode ? blueprintDarkTheme : blueprintTheme;

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Container>
        <NavBar
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
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
