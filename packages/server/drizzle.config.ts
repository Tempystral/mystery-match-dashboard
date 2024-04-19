import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/data/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: "",
  },
});
