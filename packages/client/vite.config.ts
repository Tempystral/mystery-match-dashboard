import { default as vue } from "@vitejs/plugin-vue";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { defineConfig, loadEnv } from "vite";
import checker from "vite-plugin-checker";
import vuetify from "vite-plugin-vuetify";
//import serverPackageJson from "@mmd/server/package.json" assert { type: "json" };
import packageJson from "./package.json";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async ({ mode = "DEV" }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    root: "./src",
    build: {
      outDir: "./build",
      emptyOutDir: true,
    },
    server: {
      port: 5173,
    },
    plugins: [vue(), vuetify(), checker({ vueTsc: { tsconfigPath: "./tsconfig.json" } })],
    optimizeDeps: {
      include: ["@mmd/common"],
      exclude: ["@tanstack/vue-query"],
    },
    resolve: {
      alias: {
        "@client": `${__dirname}/src`,
      },
    },
  });
};
