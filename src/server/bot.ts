import { Koa } from "@discordx/koa";
import { IntentsBitField } from "discord.js";
import { Client } from "discordx";

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

bot.once("ready", async () => {
  await bot.initApplicationCommands();

  console.log("Bot started");
});

export async function setup_rest() {
  const server = new Koa({
    
  });

  // api: need to build the api server first
  await server.build();

  // api: let's start the server now
  const port = process.env.PORT ?? 3000;
  server.listen(port, () => {
    console.log(`discord api server started on ${port}`);
    console.log(`visit localhost:${port}/guilds`);
  });
}
