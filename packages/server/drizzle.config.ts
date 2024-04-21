import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/data/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    host: "localhost",
    port: 5432,
    database: "mmd",
    user: "azurite",
    password: "azurite",
  },
});

/*
Steps:
1. Install postgres
2. Run `sudo -u postgres psql`
3. Run `CREATE USER <username>;`
4. Run `GRANT postgres TO <username> INHERIT TRUE;`
Create new db
Assign password and configure it

https://dev.to/franciscomendes10866/getting-started-with-drizzle-orm-a-beginners-tutorial-4782
pnpm drizzle-kit generate:pg
pnpm drizzle-kit push:pg
pnpm drizzle-kit studio
*/
