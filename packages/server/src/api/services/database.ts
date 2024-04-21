import {
  MatchId,
  MatchInsertParams,
  MatchParams,
  MatchResponse,
  MatchUpdateRequest,
  PlayerId,
  PlayerInMatch,
  PlayerInsertParams,
  PlayerResponse,
  PlayerUpdateParams,
} from "@mmd/common";
import { SQL, and, eq, or } from "drizzle-orm";
import { PgTableWithColumns, TableConfig } from "drizzle-orm/pg-core";
import { match, player, score } from "../../data/schema.js";
import { database } from "../../setup.js";
import { QueryParamError } from "@mmd/common";

async function getPlayer(id: PlayerId): Promise<PlayerResponse | undefined> {
  const result = await database.query.player.findFirst({
    where: eq(player.player_id, id),
  });
  return result;
}

/* Players */

async function getPlayers(params?: PlayerUpdateParams) {
  return await database.select().from(player).where(buildSearchParams(player, params));
}
async function getMatchPlayers(match: MatchId): Promise<PlayerInMatch[]> {
  return await database
    .select({
      player: {
        player_id: player.player_id,
        twitch_name: player.twitch_name,
        discord_name: player.discord_name,
        in_brackets: player.in_brackets,
        status: player.status,
        pronouns: player.pronouns,
      },
      score: {
        outcome: score.outcome,
        points: score.points,
      },
    })
    .from(player)
    .leftJoin(score, eq(score.player_id, player.player_id))
    .where(eq(score.match_id, match));
}

async function addPlayer(p: PlayerInsertParams) {
  return await database.insert(player).values(p).returning();
}

async function addPlayers(...ps: PlayerInsertParams[]) {
  return await database.insert(player).values(ps).returning();
}

/* Matches */

async function getMatch(id: MatchId): Promise<MatchResponse | undefined> {
  const result = await database.query.match.findFirst({
    where: eq(match.match_id, id),
  });
  return result;
}

async function getMatches(params?: MatchParams) {
  return await database.select().from(match).where(buildSearchParams(match, params));
}

async function addMatch(m: MatchInsertParams) {
  return await database.insert(match).values(m).returning();
}

async function addMatches(...ms: MatchInsertParams[]) {
  return await database.insert(match).values(ms).returning();
}

async function updateMatch(req: MatchUpdateRequest) {
  const result = await database.transaction(async (tx) => {
    await database.update(match).set(req.match).where(eq(match.match_id, req.match_id));
    console.log(`Updated ${req.match_id} with ${req.match}`);

    await database.transaction(async (tx2) => {
      await database.delete(score).where(or(...req.players.remove.map((pid) => eq(score.player_id, pid))));
      console.log(`Removed ${req.players.remove} from ${req.match_id}`);

      await database.insert(score).values(
        req.players.add.map((updVal) => ({
          match_id: req.match_id,
          ...updVal,
        })),
      );
      console.log(`Added ${req.players.add} to ${req.match_id}`);
    });
    const updatedScores = await database.transaction(async (tx3) => {
      const updated = req.players.update.map((p) => {
        const values = {
          ...(p.outcome && { outcome: p.outcome }),
          ...(p.points && { points: p.points }),
        };
        database.update(score).set(values).where(eq(score.player_id, p.player_id)).returning();
      });
      await Promise.all(updated);
      console.log(`Updated values ${req.players.update} for match ${req.match_id}`);
    });
  });
}

function buildSearchParams<T extends TableConfig>(schema: PgTableWithColumns<T>, params?: Object) {
  if (params) {
    const ps = Object.entries(params)
      .filter((entry) => entry[1])
      .reduce((arr, entry) => {
        const [key, val] = entry;
        if (schema[key] == undefined) {
          throw new QueryParamError(`Unknown search parameter: ${key}`);
        } else {
          arr.push(eq(schema[key], val));
        }
        return arr;
      }, [] as SQL<unknown>[]);
    return and(...ps);
  }
  return;
}

export default {
  getPlayer,
  getPlayers,
  getMatchPlayers,
  addPlayer,
  addPlayers,
  getMatch,
  getMatches,
  addMatch,
  addMatches,
};
