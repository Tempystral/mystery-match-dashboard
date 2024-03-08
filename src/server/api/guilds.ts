import { Get, Post, Router } from "@discordx/koa";
import type { Context } from "koa";

import { bot } from "../bot.js";

@Router()
export class API {
  @Get("/")
  index(context: Context): void {
    context.body = `
      <div style="text-align: center">
        <h1>
          <a href="https://discordx.js.org">discord.ts</a> rest api server example
        </h1>
        <p>
          powered by <a href="https://koajs.com/">koa</a> and
          <a href="https://www.npmjs.com/package/@discordx/koa">@discordx/koa</a>
        </p>
      </div>
    `;
  }

  @Get()
  guilds(context: Context): void {
    context.body = `${bot.guilds.cache
      .map((g) => `${g.id}: ${g.name}`)
      .join("\n")}`;
  }

  @Post()
  login(context: Context): void {
    context.body
  }
  /* I can probably just build this with any web framework, like vue + vite if I wanted to. It seems like the bot is just another component. */
}
