import { Events, IntentsBitField } from "discord.js";
import { Client } from "discordx";

import express from "express";
import helmet from "helmet";
import cors from "cors";
import router from "./api/router.js";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./data/schema.js";

function setup_web() {
  const app = express();

  app.use(express.json());
  app.use(helmet());
  app.use(cors({}));
  app.use(router);

  const port = process.env.PORT ?? 3000;
  app.listen(port, () => {
    console.log(`REST server started on ${port}`);
    console.log(`Visit localhost:${port}/`);
  });
  return app;
}

async function setup_database() {
  const client = new pg.Client({
    host: "localhost",
    port: Number(process.env.PGPORT) ?? 5432,
    database: process.env.PGDB,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
  });
  await client.connect();
  const s = { ...schema };
  const db = drizzle(client, { schema: s });
  return db;
}

async function setup_bot() {
  const bot = new Client({
    intents: [
      IntentsBitField.Flags.Guilds,
      IntentsBitField.Flags.GuildMessages,
      IntentsBitField.Flags.GuildMessageReactions,
      IntentsBitField.Flags.GuildVoiceStates,
      IntentsBitField.Flags.MessageContent,
    ],
    silent: false,
  });

  bot.once(Events.ClientReady, async (client) => {
    await bot.initApplicationCommands();

    console.log(`Bot started, logged in as ${client.user.tag}`);
  });
  return bot;
}

const bot = await setup_bot();
const database = await setup_database();
const server = setup_web();

export { bot, server, database };
