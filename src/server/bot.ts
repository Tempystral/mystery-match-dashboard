import { Koa } from "@discordx/koa";
import { Events, IntentsBitField } from "discord.js";
import { Client } from "discordx";
import { Match, MatchPlayer, Player } from "../data/models.js";
import { Sequelize } from "@sequelize/core";

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

const sq = new Sequelize({
  database: "database",
  username: "user",
  password: "password",
  dialect: "sqlite",
  logging: false,
  storage: "database.sqlite",
  models: [Player, Match, MatchPlayer],
});

bot.once(Events.ClientReady, async (client) => {
  await bot.initApplicationCommands();

  await setup_database();

  console.log(`Bot started, logged in as ${client.user.tag}`);
});

async function setup_database() {
  await Match.sync();
  await Player.sync();
  await MatchPlayer.sync();
}

export default bot;
