import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import styled, { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "./styles/themes";
import { GlobalStyles } from "./styles/globalStyles";
import FooterBar from "./components/composits/FooterBar";
import NavBar from "./components/composits/NavBar";
import Home from "./pages/Home";
import { PROJECTS } from "./pages/projects";

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <BrowserRouter>
        <Container>
          <NavBar
            isDarkMode={isDarkMode}
            onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
          />
          <Content>
            <Routes>
              <Route path="/" element={<Home />} />
              {PROJECTS.map((project) => (
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