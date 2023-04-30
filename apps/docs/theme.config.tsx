import React from "react";
import { DocsThemeConfig } from "nextra-theme-docs";

const config: DocsThemeConfig = {
  logo: <span>Highstorm</span>,
  project: {
    link: "https://github.com/chronark/highstorm",
  },

  logoLink: "https://highstorm.app/favicon.png",
  primaryHue: {
    light: 217,
    dark: 43,
  },
  gitTimestamp: true,
  darkMode: true,
  docsRepositoryBase: "https://github.com/chronark/highstorm/tree/main/apps/docs/",
  footer: {
    text: "Highstorm Docs",
  },
};

export default config;
