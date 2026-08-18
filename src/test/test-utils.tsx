import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
// The theme the site actually ships, so tests exercise the real token values.
import { blueprintTheme } from "../styles/themes";

function AllTheProviders({ children }: { children: React.ReactNode }) {
  return <ThemeProvider theme={blueprintTheme}>{children}</ThemeProvider>;
}

function customRender(ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) {
  return render(ui, {
    wrapper: AllTheProviders,
    ...options
  });
}

export * from "@testing-library/react";
export { customRender as render };
