import { defineConfig } from "vitepress";

const umamiScript = ["script", {
  defer: "true",
  src: "https://cloud.umami.is/script.js",
  "data-website-id": "c8101198-d324-4021-b22b-963a60bcedf4"
}];

const baseHeaders = [];

const headers = process.env.NODE_ENV === "production" ?
  [...baseHeaders, umamiScript] :
  baseHeaders;

// https://vitepress.dev/reference/site-config
export default defineConfig({
  head: headers,
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
