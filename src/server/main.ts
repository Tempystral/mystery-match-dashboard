import { dirname, importx } from "@discordx/importer";
import "dotenv/config";
import bot from "./bot.js";
import setup_web from "./web.js";

async function run() {
  await importx(`${dirname(import.meta.url)}/{events,commands,api}/**/*.{ts,js}`);

  if (!process.env.BOT_TOKEN) {
    throw Error("Could not find BOT_TOKEN in your environment");
  }
  await bot.login(process.env.BOT_TOKEN);
  await setup_web();
}

void run();
