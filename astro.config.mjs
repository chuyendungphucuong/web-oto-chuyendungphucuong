import sitemap from "@astrojs/sitemap";
// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import node from '@astrojs/node';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://chuyendungphucuong.vn',
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()]
  }
});
