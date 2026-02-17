import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import styled, { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "./styles/themes";
import { GlobalStyles } from "./styles/globalStyles";
import FooterBar from "./components/composits/FooterBar";
import NavBar from "./components/composits/NavBar";
import Home from "./pages/Home";
import { PROJECTS } from "./pages/projects";

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}

const getPrefersDark = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(getPrefersDark);
  const theme = isDarkMode ? darkTheme : lightTheme;

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <BrowserRouter>
        <ScrollToTop />
        <Container>
          <NavBar
            isDarkMode={isDarkMode}
            onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
          />
          <Content>
            <Routes>
              <Route path="/" element={<Home />} />
              {PROJECTS.filter(
                (p): p is typeof p & { component: NonNullable<typeof p["component"]> } =>
                  !p.external && !!p.component
              ).map((project) => (
                <Route
                  key={project.id}
                  path={project.path}
                  element={<project.component project={project} />}
                />
              ))}
            </Routes>
          </Content>
          <FooterBar />
        </Container>
      </BrowserRouter>
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
  min-height: 80vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;



export default App;