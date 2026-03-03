import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Physical AI & Humanoid Robotics Textbook',
  tagline: 'Bridging Digital Intelligence with Physical Form',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://physical-ai-textbook.vercel.app',
  // Set the /<baseUrl>/ pathname under which your site is served
  baseUrl: '/',

  // GitHub pages deployment config.
  organizationName: 'ashfaq1192',
  projectName: 'Physical-Ai-Book-Hackathon-I',

  onBrokenLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/ashfaq1192/Physical-Ai-Book-Hackathon-I/tree/main/book-app/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Physical AI & Humanoid Robotics',
      logo: {
        alt: 'Panaversity Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Textbook',
        },
        {
          to: '/signup',
          label: 'Sign Up',
          position: 'right',
        },
        {
          href: 'https://github.com/ashfaq1192/Physical-Ai-Book-Hackathon-I',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Textbook',
          items: [
            {
              label: 'Module 1: ROS 2',
              to: '/docs/module-1/intro',
            },
            {
              label: 'Module 2: Gazebo & Unity',
              to: '/docs/module-2/intro',
            },
            {
              label: 'Module 3: NVIDIA Isaac',
              to: '/docs/module-3/isaac-intro',
            },
            {
              label: 'Module 4: VLA Models',
              to: '/docs/module-4/vla-intro',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Panaversity',
              href: 'https://panaversity.org',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/ashfaq1192/Physical-Ai-Book-Hackathon-I',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Panaversity. All rights reserved.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
