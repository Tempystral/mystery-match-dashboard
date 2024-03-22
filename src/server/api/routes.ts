import { Get, Post, Router } from "@discordx/koa";
import type { Context } from "koa";
import { bot } from "../bot.js";
import sheets from "./services/sheetsService.js";
import { Match, Player } from "../../data/models.js";

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
    context.body = `${bot.guilds.cache.map((g) => `${g.id}: ${g.name}`).join("\n")}`;
  }

  @Get()
  async matches(context: Context) {
    const doc = await sheets.loadDocument(process.env.MATCHES_SPREADSHEET!);
    await sheets.buildMatches(doc);
    const matches = await Match.findAll({ include: [Player] });
    context.body = matches;
  }

  @Get()
  async players(context: Context) {
    const doc = await sheets.loadDocument(process.env.MATCHES_SPREADSHEET!);
    await sheets.buildPlayers(doc);

    const players = await Player.findAll();
    context.body = players;
  }

  @Get()
  async clear(context: Context) {
    await Player.truncate();
    await Match.truncate();
    context.body = "Cleared!";
  }

  @Post()
  login(context: Context): void {
    context.body;
  }
}
