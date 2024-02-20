import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: "/portfolio/",
  head: [["link", { rel: "icon", href: "/portfolio/favicon.ico" }]],
  title: "Michel Carlos - Software Engineer",
  description: "Software Engineer",
  themeConfig: {
    siteTitle: "Michel Carlos 🇧🇷",
    nav: [
      { text: "Home", link: "/" },
      { text: "About", link: "/about" },
    ],

    // No sidebar for now
    // sidebar: [
    //   {
    //     text: "Examples",
    //     items: [
    //       { text: "Markdown Examples", link: "/markdown-examples" },
    //       { text: "Runtime API Examples", link: "/api-examples" },
    //     ],
    //   },
    // ],

    footer: {
      copyright: `Released under the MIT License | Copyright © 2024-present Michel Carlos`,
    },
    socialLinks: [
      {
        icon: "linkedin",
        link: "https://www.linkedin.com/in/micheldpcarlos/",
        ariaLabel: "Michel Carlos LinkedIn link",
      },
      {
        icon: "github",
        link: "https://github.com/micheldpcarlos",
        ariaLabel: "Michel Carlos GitHub link",
      },
      {
        icon: "instagram",
        link: "https://www.instagram.com/micheldpcarlos/",
        ariaLabel: "Michel Carlos Instagram link",
      },
    ],
  },
});
