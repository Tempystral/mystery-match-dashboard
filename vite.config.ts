import { default as vue } from '@vitejs/plugin-vue';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import vuetify from 'vite-plugin-vuetify';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  root: "./src/client",
  build: {
    outDir: "../../build/client",
    emptyOutDir: true
  },
  server: {
    port: 5173,
  },
  plugins: [
    vue(),
    vuetify(),
    checker({ vueTsc: { tsconfigPath: 'tsconfig.client.json' } }),
  ],
  resolve: {
    
    alias: {
      "@": `${__dirname}/src/client`,
    }
  },
  
});