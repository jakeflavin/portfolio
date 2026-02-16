import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "./styles/themes";
import { GlobalStyles } from "./styles/globalStyles";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}
const root = ReactDOM.createRoot(rootElement);

root.render(
  <ThemeProvider theme={lightTheme}>
    <GlobalStyles />
    <App />
  </ThemeProvider>
);