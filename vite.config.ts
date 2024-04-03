import { default as vue } from "@vitejs/plugin-vue";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { defineConfig, loadEnv } from "vite";
import checker from "vite-plugin-checker";
import vuetify from "vite-plugin-vuetify";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default ({ mode = "DEV" }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    root: "./src/client",
    build: {
      outDir: "../../build/client",
      emptyOutDir: true,
    },
    server: {
      port: 5173,
    },
    plugins: [
      /* tsconfig({ filename: "tsconfig.client.json" }), */
      vue(),
      vuetify(),
      checker({ vueTsc: { tsconfigPath: "tsconfig.client.json" } }),
    ],
    optimizeDeps: {
      exclude: ["@tanstack/vue-query"],
    },
    resolve: {
      alias: {
        "@client": `${__dirname}/src/client`,
        "@server": `${__dirname}/src/server`,
      },
    },
  });
};
