// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://laravelseo.com',
  integrations: [react(), sitemap({
    filter: (page) => !page.includes('/posts/'),
  })],
  output: 'server',
  adapter: cloudflare(),
  vite: {
    build: {
      rollupOptions: { maxParallelFileOps: 32 },
    },
    plugins: [tailwindcss()],
    ssr: {
      external: ["sharp", "detect-libc"]
    }
  }
});