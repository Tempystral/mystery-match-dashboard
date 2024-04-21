import {
  MatchResponse,
  MatchInsertParams,
  PlayerParams,
  PlayerInsertParams,
  PlayerResponse,
  MatchParams,
} from "@mmd/common";
import { SQLWrapper, eq, sql } from "drizzle-orm";
import { match, player } from "../../data/schema.js";
import { database } from "../../setup.js";

async function getPlayer(id: string): Promise<PlayerResponse | undefined> {
  const result = await database.query.player.findFirst({
    where: eq(player.player_id, id),
  });
  return result;
}

function buildParamString(params?: Object) {
  if (params) {
    const pstr = Object.entries(params)
      .filter((e) => e[1])
      .map((e) => {
        return `${e[0]} = ${e[1]}`;
      });
    return sql`${pstr?.join(" and ")}`;
  }
  return;
}

async function getPlayers(params?: PlayerParams) {
  return await database.select().from(player).where(buildParamString(params));
}

async function addPlayer(p: PlayerInsertParams) {
  return await database.insert(player).values(p).returning();
}

async function addPlayers(...ps: PlayerInsertParams[]) {
  await database.insert(player).values(ps).returning();
}

async function getMatch(id: string): Promise<MatchResponse | undefined> {
  const result = await database.query.match.findFirst({
    where: eq(match.match_id, id),
  });
  return result;
}

async function getMatches(params?: MatchParams) {
  return await database.select().from(match).where(buildParamString(params));
}

async function addMatch(m: MatchInsertParams) {
  return await database.insert(match).values(m).returning();
}

async function addMatches(...ms: MatchInsertParams[]) {
  await database.insert(match).values(ms).returning();
}

export default {
  getPlayer,
  getPlayers,
  addPlayer,
  addPlayers,
  getMatch,
  getMatches,
  addMatch,
  addMatches,
};
