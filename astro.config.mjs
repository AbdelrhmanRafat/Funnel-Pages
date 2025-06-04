// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";  
import react from '@astrojs/react';
import node from '@astrojs/node';

export default defineConfig({
  output: 'server',
  integrations: [react()],
  adapter: node({ mode: 'standalone' }), // or 'middleware' if you want to use it inside Express
    vite: {
    plugins: [tailwindcss()],
  },
});