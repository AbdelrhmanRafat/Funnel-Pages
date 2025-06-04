// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import react from '@astrojs/react';
import node from '@astrojs/node';

export default defineConfig({
  output: 'server',
  integrations: [react(), tailwind()],
  adapter: node({ mode: 'standalone' }), // or 'middleware' if you want to use it inside Express
});