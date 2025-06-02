// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";  
import node from '@astrojs/node';

export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }), // or 'middleware' if you want to use it inside Express
    vite: {
    plugins: [tailwindcss()],
  },
});