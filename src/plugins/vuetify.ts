import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
// MUST be imported right after `vuetify/styles` — gives our body/html
// background higher cascade priority than Vuetify's defaults.
import "@/styles/global.css";

import { createVuetify } from "vuetify";

export default createVuetify({
  theme: {
    defaultTheme: "tesham",
    themes: {
      tesham: {
        dark: true,
        colors: {
          primary: "#C9A227",
          secondary: "#8B6914",
          accent: "#F0C940",
          background: "#060606",
          surface: "#0e0e0e",
          "surface-variant": "#161410",
          error: "#c0613a",
          info: "#0284c7",
          success: "#047857",
          warning: "#d97706",
          "on-primary": "#0a0a0a",
          "on-secondary": "#faeec8",
          "on-background": "#faeec8",
          "on-surface": "#faeec8",
        },
      },
    },
  },
  defaults: {
    VBtn: {
      rounded: "lg",
      elevation: 0,
    },
    VCard: {
      rounded: "xl",
      elevation: 0,
    },
    VTextField: {
      variant: "outlined",
      rounded: "lg",
      density: "comfortable",
    },
    VTextarea: {
      variant: "outlined",
      rounded: "lg",
    },
    VSelect: {
      variant: "outlined",
      rounded: "lg",
      density: "comfortable",
    },
  },
});
