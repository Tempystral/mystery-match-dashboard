import { MatchResponse, PlayerParams, PlayerResponse } from "@mmd/common";
import { SQLWrapper, eq } from "drizzle-orm";
import { match, player } from "../../data/schema.js";
import { database } from "../../setup.js";

export async function getPlayer(id: string): Promise<PlayerResponse | undefined> {
  const result = await database.query.player.findFirst({
    where: eq(player.player_id, id),
  });
  return result;
}

export async function getPlayers(params?: PlayerParams) {
  if (params) {
    const filter = Object.entries(params)
      .filter((e) => e[1])
      .map((e) => {
        return e;
      });
  }
  const result = await database.query.player.findMany({
    where: (fields, { and, eq }) => {
      const fieldnames = Object.keys(fields) as Array<keyof typeof fields>;
      const checks = fieldnames.reduce((checks, field) => {
        if (field === "player_id") return checks;
        if (params && params[field] != null && params[field] != undefined) {
          checks.push(eq(fields[field], params[field]));
          return checks;
        }
        return checks;
      }, [] as Array<SQLWrapper>);
      return and(...checks);
    },
  });
  return result;
}

export async function getMatch(id: string): Promise<MatchResponse | undefined> {
  const result = await database.query.match.findFirst({
    where: eq(match.match_id, id),
  });
  return result;
}

export async function getMatches() {}
