import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet, GoogleSpreadsheetRow } from "google-spreadsheet";
import { JWT } from "google-auth-library";

import { range } from "discord.js";
import { Player, Match, Score } from "../../../data/models.js";
import { Op } from "@sequelize/core";
import { format, parse } from "date-fns";

class GoogleSheetsService {
  #auth?: JWT;

  private constructor(auth?: JWT) {
    this.#auth = auth;
  }

  static async init(email?: string, key?: string) {
    const serviceAccountAuth = new JWT({
      email,
      key,
      scopes: ["https://www.googleapis.com/auth/spreadsheets", "https://www.googleapis.com/auth/drive.file"],
    });
    return new GoogleSheetsService(serviceAccountAuth);
  }

  async loadDocument(docId: string) {
    if (!this.#auth) throw new Error("Not authorized! Run init() first.");

    const doc = new GoogleSpreadsheet(docId, this.#auth);
    await doc.loadInfo();
    return doc;
  }

  async buildMatches(doc: GoogleSpreadsheet) {
    const sheet = await doc.sheetsByTitle["Kuso8 Matches"];
    await sheet.loadCells("A1:I1");
    const tourney = sheet.getCell(0, 0).value?.toString();
    if (!tourney) {
      console.log("Tournament header not readable");
      return;
    }

    await sheet.loadHeaderRow(3);
    const rows = await sheet.getRows({ offset: -3 });
    // eslint-disable-next-line tseslint/no-explicit-any
    rows.unshift(new GoogleSpreadsheetRow<Record<string, any>>(sheet, 0, [""]));
    // Loads all the rows with a header not at the top. This way I only have to load the rows for reading once.

    const dayHeaders = rows.filter((r) => this.isDayHeader(r));

    rows.forEach(async (row, i, arr) => {
      if (dayHeaders.includes(row)) {
        // This is a day header, process the day
        const headerRow = arr[i + 1];
        const nextDay = this.getNextDay(dayHeaders, row)?.rowNumber ?? arr.length;

        console.log(`Getting ${nextDay - headerRow.rowNumber} rows starting at ${headerRow.rowNumber + 1}`);
        await this.buildMatchesForDay(tourney, row, arr, headerRow.rowNumber, nextDay);
      }
    });
  }

  private isDayHeader(row: GoogleSpreadsheetRow) {
    return !isNaN(Date.parse(row.get("Time")));
  }

  private getNextDay(days: GoogleSpreadsheetRow[], row: GoogleSpreadsheetRow) {
    return days[days.findIndex((day) => day.rowNumber === row.rowNumber) + 1];
  }

  private async buildMatchesForDay(
    tourney: string,
    dayRow: GoogleSpreadsheetRow,
    rows: GoogleSpreadsheetRow[],
    start: number,
    end: number,
  ) {
    for (const j of range({ start: start + 1, end: end, step: 4 })) {
      if (rows[j]?.get("Time")) {
        // There is a match here
        await this.buildMatch(tourney, dayRow, rows.slice(j, j + 4));
      }
    }
  }

  private buildDate(day: string, time: string) {
    time = time.replace(/EST|EDT/, "");
    return parse(`${day.trim()} ${time.trim()}`, "EEEE, MMMM d, y hh:mmaaaaaa", new Date());
  }

  private async buildMatch(tourney: string, dayRow: GoogleSpreadsheetRow, rows: GoogleSpreadsheetRow[]) {
    const d = this.buildDate(dayRow.get("Time"), rows[0].get("Time"));
    const l = Number((rows[0].get("Length") as string).match(/\d+/)?.[0]);
    const [match, created] = await Match.findCreateFind({
      where: {
        tournament: tourney,
        date: d,
      },
      defaults: {
        tournament: tourney,
        date: d,
        game: rows[0].get("Game"),
        platform: rows[0].get("Game Platform"),
        gamemaster: rows[0].get("GM"),
        round: rows[0].get("Round"),
        length: l,
        vod: rows[0].get("VOD"),
      },
      include: [
        {
          model: Player,
          as: "players",
        },
      ],
    });
    if (created) {
      console.log(`Created ${match.match_id}`);
      const players = await this.getPlayersInMatch(rows);
      console.log(
        `Found ${players.length} players: [${players.map((p) => " " + p.player?.twitch_name)}] for match ${match.match_id} at ${match.date}}`,
      );
      players.forEach(async (p) => {
        if (p.player) {
          console.log(`Adding ${p.player.twitch_name} with score ${p.points} to match ${match.game}`);
          await match.addPlayer(p.player, { through: { points: p.points } });
        }
      });

      console.log("Added players to match.");
    } else {
      console.log(`Could not create ${match?.match_id}`);
    }
  }

  async buildPlayers(doc: GoogleSpreadsheet) {
    const sheet = await doc.sheetsByTitle["Kuso8 Players"];
    await sheet.loadHeaderRow(1);
    const rows = await sheet.getRows();

    rows.forEach(async (row) => {
      const [player, created] = await Player.findCreateFind({
        where: {
          twitch_name: row.get("Twitch Name"),
          discord_name: row.get("Discord Name"),
        },
        defaults: {
          twitch_name: row.get("Twitch Name"),
          discord_name: row.get("Discord Name"),
          twitter_name: row.get("Twitter Handle"),
          pronunciation_notes: row.get("Name Pronunciation"),
          twitch_alt: row.get("Alt Stream Name"),
          pronouns: row.get("Preferred Pronouns"),
          accessibility: row.get("Accessibility Needs"),
          timezone: row.get("Timezone"),
          availability: row.get("Availability"),
          notes: row.get("Notes"),
        },
        include: [
          {
            model: Match,
            as: "matches",
          },
        ],
      });
      if (created) {
        console.log(`Created player ${player.twitch_name}`);
      } else {
        console.log(`Could not create player ${row.get("Twitch Name")}!`);
      }
    });
  }

  private async getPlayersInMatch(rows: GoogleSpreadsheetRow[]) {
    const players = await Player.findAll({
      where: {
        [Op.or]: rows.map((r) => {
          return { twitch_name: r.get("Players") as string };
        }),
      },
    });

    return rows.map((r) => {
      const twitch_name = r.get("Players") as string;
      const score = r.get("Scores") as number;
      return { player: players.find((p) => p.twitch_name === twitch_name), points: score };
    });
  }
}

const service = await GoogleSheetsService.init(
  process.env.GOOGLE_CLIENT_EMAIL,
  process.env.GOOGLE_PRIVATE_KEY,
);

export default service;
