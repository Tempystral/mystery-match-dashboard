import { dirname, importx } from "@discordx/importer";
import "dotenv/config";
import { bot, setup_rest } from "./bot.js";

async function run() {
  await importx(`${dirname(import.meta.url)}/{events,commands,api}/**/*.{ts,js}`);

  if (!process.env.BOT_TOKEN) {
    throw Error("Could not find BOT_TOKEN in your environment");
  }
  await bot.login(process.env.BOT_TOKEN);
  await setup_rest();
}

void run();
