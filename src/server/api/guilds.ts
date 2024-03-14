import { Get, Post, Router } from "@discordx/koa";
import type { Context } from "koa";
import { GoogleSheetsService } from "./services/sheetsService.js";
import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet, GoogleSpreadsheetRow } from "google-spreadsheet";
import { bot } from "../bot.js";

@Router()
export class API {
  private sheetsService: GoogleSheetsService | undefined;

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
    const sheets = await this.getSheetsService();
    const doc = await sheets.loadDocument(process.env.MATCHES_SPREADSHEET!);
    const sheet = await doc.sheetsByTitle["Kuso8 Matches"];

    await sheet.loadHeaderRow(3);
    const rows = await sheet.getRows({ offset: -3 });
    // eslint-disable-next-line tseslint/no-explicit-any
    rows.unshift(new GoogleSpreadsheetRow<Record<string, any>>(sheet, 0, [""]));
    // Loads all the rows with a header not at the top. This way I only have to load the rows for reading once.

    const dayHeaders = rows.filter((r) => this.isDayHeader(r));

    context.body = sheets.getMatches(rows, dayHeaders);
  }

  private isDayHeader(row: GoogleSpreadsheetRow) {
    return !isNaN(Date.parse(row.get("Time")));
  }

  @Post()
  login(context: Context): void {
    context.body;
  }

  private async getSheetsService() {
    if (!this.sheetsService) {
      this.sheetsService = await GoogleSheetsService.init(
        process.env.GOOGLE_CLIENT_EMAIL,
        process.env.GOOGLE_PRIVATE_KEY,
      );
    }
    return this.sheetsService;
  }
}
