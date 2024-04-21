import { JWT } from "google-auth-library";
import { GoogleSpreadsheet, GoogleSpreadsheetRow } from "google-spreadsheet";

import { parse } from "date-fns";
import { range } from "discord.js";
import { Round, PlayerStatus, Outcome } from "@mmd/common";

import { match, player, score } from "../../data/schema.js";
import database from "./database.js";
import { database as db } from "../../setup.js";
import { eq, or } from "drizzle-orm";

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

  private getRound(rows: GoogleSpreadsheetRow[]): Round {
    const round = rows[0].get("Round") as string;
    if (round.includes("Group")) {
      const subround = rows[1].get("Round") as string;
      switch (subround) {
        case "Round 1":
          return Round.GROUP_STAGE_R_1;
        case "Round 2":
          return Round.GROUP_STAGE_R_2;
        case "Round 3":
          return Round.GROUP_STAGE_R_3;
        case "Round 4":
          return Round.GROUP_STAGE_R_4;
      }
    } else if (round.includes("Tiebreakers")) {
      return Round.TIEBREAKERS;
    } else if (round.includes("Winner")) {
      if (round.match(/Winner.*Final/)) {
        return Round.WINNERS_FINALS;
      } else {
        const roundNum = Number(round.trim().at(-1));
        switch (roundNum) {
          case 1:
            return Round.WINNERS_1;
          case 2:
            return Round.WINNERS_2;
          case 3:
            return Round.WINNERS_3;
          case 4:
            return Round.WINNERS_4;
        }
      }
    } else if (round.includes("Loser")) {
      if (round.match(/Loser.*Final/)) {
        return Round.LOSERS_FINALS;
      } else {
        const roundNum = Number(round.trim().at(-1));
        switch (roundNum) {
          case 1:
            return Round.LOSERS_1;
          case 2:
            return Round.LOSERS_2;
          case 3:
            return Round.LOSERS_3;
          case 4:
            return Round.LOSERS_4;
          case 5:
            return Round.LOSERS_5;
          case 6:
            return Round.LOSERS_6;
          case 7:
            return Round.LOSERS_7;
        }
      }
    }
    console.log(`Unknown round for value: ${round}`);
    return Round.UNKNOWN;
  }

  private async buildMatch(tourney: string, dayRow: GoogleSpreadsheetRow, rows: GoogleSpreadsheetRow[]) {
    const d = this.buildDate(dayRow.get("Time"), rows[0].get("Time"));
    const l = Number((rows[0].get("Length") as string).match(/\d+/)?.[0]);
    const added = await database.addMatch({
      date: d,
      tournament: tourney,
      game: rows[0].get("Game"),
      platform: rows[0].get("Game Platform"),
      gamemaster: rows[0].get("GM"),
      round: this.getRound(rows),
      length: l,
      vod: rows[0].get("VOD"),
    });

    if (added[0]) {
      console.log(`Created ${added[0].match_id}`);
      const matchPlayers = await this.getPlayersInMatch(rows);
      console.log(
        `Found ${matchPlayers.length} players: [${matchPlayers.map((p) => " " + p.player?.twitch_name)}] for match ${added[0].match_id} at ${added[0].date}}`,
      );

      await db.insert(score).values(
        matchPlayers
          .filter((p) => p.player != undefined)
          .map((p) => {
            console.log(`Adding ${p.player!.twitch_name} with score ${p.points} to match ${added[0].game}`);
            return {
              match_id: added[0].match_id,
              player_id: p.player!.player_id,
              outcome: p.outcome,
              points: p.points,
            };
          }),
      );

      console.log("Added players to match.");
    } else {
      console.log(`Could not create match for date ${d}`);
    }
  }

  async buildPlayers(doc: GoogleSpreadsheet) {
    const sheet = await doc.sheetsByTitle["Kuso8 Players"];
    await sheet.loadHeaderRow(1);
    const rows = await sheet.getRows();

    rows.forEach(async (row) => {
      const p = await database.addPlayer({
        twitch_name: row.get("Twitch Name") as string,
        discord_name: row.get("Discord Name") as string,
        twitter_name: row.get("Twitter Handle") as string,
        pronunciation_notes: row.get("Name Pronunciation") as string,
        twitch_alt: row.get("Alt Stream Name") as string,
        pronouns: row.get("Preferred Pronouns") as string,
        accessibility: row.get("Accessibility Needs") as string,
        timezone: row.get("Timezone") as string,
        availability: row.get("Availability") as string,
        notes: row.get("Notes") as string,
        in_brackets: false,
        status: PlayerStatus.ACTIVE,
      });

      if (p[0]) {
        console.log(`Created player ${p[0].twitch_name}`);
      } else {
        console.log(`Could not create player ${row.get("Twitch Name")}!`);
      }
    });
  }

  private async getPlayersInMatch(rows: GoogleSpreadsheetRow[]) {
    const tests = rows.map((r) => eq(player.twitch_name, r.get("Players") as string));
    const players = await db
      .select()
      .from(player)
      .where(or(...tests));

    return rows.map((r) => {
      const { outcome, points } = parsePoints(r.get("Scores"));
      return {
        player: players.find((p) => p.twitch_name === (r.get("Players") as string)),
        outcome,
        points,
      };
    });
  }
}

function parsePoints(input: string | number) {
  let outcome = Outcome.SCORE;
  let points = 0;
  if (Number(input)) {
    points = input as number;
  } else {
    switch (input) {
      case "Mulligan":
        outcome = Outcome.MULLIGAN;
        break;
      case "Forfeit":
        outcome = Outcome.FORFEIT;
        break;
      case "Zombie":
        outcome = Outcome.ZOMBIE;
        break;
      case "Disqualified":
        outcome = Outcome.DISQUALIFIED;
        break;
      case "Lose":
        outcome = Outcome.LOSE;
        break;
      case "Win":
        outcome = Outcome.WIN;
        break;
    }
  }
  return { outcome, points };
}

const service = await GoogleSheetsService.init(
  process.env.GOOGLE_CLIENT_EMAIL,
  process.env.GOOGLE_PRIVATE_KEY,
);

export default service;
