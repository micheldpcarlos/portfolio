import { defineConfig } from "vitepress";


const baseHeaders = [
  ["meta", {
    defer: "true",
    src: "/myscript.js",
    "data-website-id": "c8101198-d324-4021-b22b-963a60bcedf4"
  }]
];

const fbMetaTags = [[
  'meta',
  { property: 'og:url', content: 'https://micheldpcarlos.com' }
],
[
  'meta',
  { property: 'og:type', content: 'website' }
],
[
  'meta',
  { property: 'og:title', content: 'Michel Carlos - Software Engineer' }
],
[
  'meta',
  { property: 'og:description', content: 'Experienced and passionate frontend specialist' }
],
[
  'meta',
  { property: 'og:image', content: '/images/meta-image.jpg' }
]];

const twitterMetaTags = [
  [
    'meta',
    { name: 'twitter:card', content: 'summary' }
  ],
  [
    'meta',
    { property: 'twitter:domain', content: 'micheldpcarlos.com' }
  ],
  [
    'meta',
    { property: 'twitter:url', content: 'https://micheldpcarlos.com' }
  ],
  [
    'meta',
    { name: 'twitter:title', content: 'Michel Carlos - Software Engineer' }
  ],
  [
    'meta',
    { name: 'twitter:description', content: 'Experienced and passionate frontend specialist' }
  ],
  [
    'meta',
    { name: 'twitter:image', content: '/images/meta-image.jpg' }
  ]
];


const headers = [...baseHeaders, ...fbMetaTags];


// Self hosting unami script to avoid adblockers 
const umamiScript = ["script", {
  defer: "true",
  src: "/myscript.js",
  "data-website-id": "c8101198-d324-4021-b22b-963a60bcedf4"
}];

// Adding only for production env
if (process.env.NODE_ENV === "production") {
  headers.push(umamiScript);
}


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
