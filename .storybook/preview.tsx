import type { Preview } from "@storybook/react";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "../src/styles/themes";
import { GlobalStyles } from "../src/styles/globalStyles";
import React from "react";

const preview: Preview = {
  decorators: [
    (Story, context) => {
      const mode = context.globals.theme || "light";
      const theme = mode === "dark" ? darkTheme : lightTheme;

      return (
        <ThemeProvider theme={theme}>
          <GlobalStyles />
          <Story />
        </ThemeProvider>
      );
    }
  ],
  globalTypes: {
    theme: {
      name: "Theme",
      defaultValue: "light",
      toolbar: {
        items: ["light", "dark"]
      }
    }
  }
};

export default preview;