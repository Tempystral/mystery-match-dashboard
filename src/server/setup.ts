import { Events, IntentsBitField } from "discord.js";
import { Client } from "discordx";
import { Match, Score, Player } from "../data/models.js";
import { Sequelize } from "@sequelize/core";

import express from "express";
import helmet from "helmet";
import router from "./api/router.js";

function setup_web() {
  const app = express();

  app.use(express.json());
  app.use(helmet());
  app.use(router);

  const port = process.env.PORT ?? 3000;
  app.listen(port, () => {
    console.log(`REST server started on ${port}`);
    console.log(`Visit localhost:${port}/`);
  });
  return app;
}

async function setup_database() {
  const sq = new Sequelize({
    database: "database",
    username: "user",
    password: "password",
    dialect: "sqlite",
    logging: false,
    storage: "database.sqlite",
    models: [Player, Match, Score],
  });

  await Match.sync();
  await Player.sync();
  await Score.sync();
  return sq;
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
