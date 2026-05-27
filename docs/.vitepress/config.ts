import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Core API',
  description: 'Developer guide for the Core service APIs',
  cleanUrls: true,
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/' },
      { text: 'API Reference', link: '/api/' },
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Overview', link: '/' },
          { text: 'API Reference', link: '/api/' },
        ],
      },
      {
        text: 'Endpoints',
        items: [
          { text: 'Users', link: '/api/users' },
          { text: 'Geography', link: '/api/geography' },
          { text: 'Temples', link: '/api/temples' },
          { text: 'Common', link: '/api/common' },
        ],
      },
    ],
    search: {
      provider: 'local',
    },
  },
})
