import { Koa } from "@discordx/koa";
import { Events, IntentsBitField } from "discord.js";
import { Client } from "discordx";
import { Match, MatchPlayer, Player } from "../data/models.js";

export const bot = new Client({
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

  let sq;
  Match.sync();
  Player.sync();
  MatchPlayer.sync();

  console.log(`Bot started, logged in as ${client.user.tag}`);
});

export async function setup_rest() {
  const server = new Koa({});

  // api: need to build the api server first
  await server.build();

  // api: let's start the server now
  const port = process.env.PORT ?? 3000;
  server.listen(port, () => {
    console.log(`discord api server started on ${port}`);
    console.log(`visit localhost:${port}/guilds`);
  });
}
