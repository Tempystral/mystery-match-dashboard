import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet, GoogleSpreadsheetRow } from "google-spreadsheet";
import { JWT } from "google-auth-library";

import { range } from "discord.js";
import type { KusograndeMatch } from "../../../model/data.js";

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

  private getNextDay(days: GoogleSpreadsheetRow[], row: GoogleSpreadsheetRow) {
    return days[days.findIndex((day) => day.rowNumber === row.rowNumber) + 1];
  }

  getMatches(rows: GoogleSpreadsheetRow[], dayHeaders: GoogleSpreadsheetRow[]) {
    return rows.flatMap((row, i, arr) => {
      if (dayHeaders.includes(row)) {
        // This is a day header, process the day
        const headerRow = arr[i + 1];
        const nextDay = this.getNextDay(dayHeaders, row)?.rowNumber ?? arr.length;

        console.log(`Getting ${nextDay - headerRow.rowNumber} rows starting at ${headerRow.rowNumber + 1}`);
        return this.getMatchesForDay(arr, headerRow.rowNumber, nextDay);
      } else {
        return [];
      }
    });
  }

  private getMatchesForDay(rows: GoogleSpreadsheetRow[], start: number, end: number) {
    const matches = [];
    for (const j of range({ start: start + 1, end: end, step: 4 })) {
      if (rows[j]?.get("Time")) {
        // There is a match here
        matches.push(this.buildMatch(rows.slice(j, j + 4)));
      }
    }
    return matches;
  }

  private buildMatch(rows: GoogleSpreadsheetRow[]): KusograndeMatch {
    return {
      date: new Date(),
      game: rows[0].get("Game"),
      platform: rows[0].get("Game Platform"),
      gamemaster: rows[0].get("GM"),
      round: rows[0].get("Round"),
      length: rows[0].get("Length"),
      vod: rows[0].get("VOD"),
      players: rows.map((r) => r.get("Players")),
      scores: rows.map((r) => r.get("Scores")),
    };
  }
}

export default await GoogleSheetsService.init(
  process.env.GOOGLE_CLIENT_EMAIL,
  process.env.GOOGLE_PRIVATE_KEY,
);
