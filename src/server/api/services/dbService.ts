import { CreationAttributes, Op, UpdateValues } from "@sequelize/core";
import { Match, Player } from "../../../shared/models.js";

const partialMatchInclude = {
  include: [
    {
      association: "matches",
      attributes: ["match_id", "game", "gamemaster", "round"],
      through: {
        attributes: ["points"],
      },
    },
  ],
};

const partialPlayerInclude = {
  include: [
    {
      association: "players",
      attributes: ["player_id", "twitch_name", "discord_name"],
      through: {
        attributes: ["points"],
      },
    },
  ],
};

const includeIf = (o: object, b: boolean) => (b ? o : {});

interface SingleGetOptions {
  id: string;
  extras: boolean;
}
interface MultiGetOptions {
  ids?: string[];
  extras: boolean;
}

export async function getPlayer({ id, extras = false }: SingleGetOptions) {
  return await Player.findByPk(id, includeIf(partialMatchInclude, extras));
}

export async function getPlayers({ ids, extras = false }: MultiGetOptions) {
  return await Player.findAll({
    where: ids ? { player_id: { [Op.in]: ids } } : {},
    ...includeIf(partialMatchInclude, extras),
  });
}

export async function createPlayer(player: CreationAttributes<Player>) {
  try {
    return await Player.build(player).save();
  } catch (error) {
    return error as Error;
  }
}

export async function createPlayers(players: CreationAttributes<Player>[]) {
  return await Promise.all(
    players.map(async (player) => {
      return await createPlayer(player);
    }),
  );
}

export async function updatePlayer(id: string, player: UpdateValues<Player>) {
  const affectedPlayer = await Player.findByPk(id);
  return await affectedPlayer?.update(player, { where: { player_id: id } });
}

export async function assignScore(match_id: string, player_id: string, score: string) {
  const match = await Match.findByPk(match_id, {
    include: [{ model: Player, where: { player_id } }],
  });
  await match?.setScore(player_id, score);
  return await match?.reload();
}

export async function getMatch({ id, extras = false }: SingleGetOptions) {
  return await Match.findByPk(id, includeIf(partialPlayerInclude, extras));
}
export async function getMatches({ ids, extras = false }: MultiGetOptions) {
  return await Match.findAll({
    where: ids ? { match_id: { [Op.in]: ids } } : {},
    order: ["date"],
    ...includeIf(partialPlayerInclude, extras),
  });
}

export async function createMatch(match: CreationAttributes<Match>) {
  try {
    return await Match.build(match).save();
  } catch (error) {
    return error as Error;
  }
}

export async function createMatches(matches: CreationAttributes<Match>[]) {
  return await Promise.all(
    matches.map(async (match) => {
      return await createMatch(match);
    }),
  );
}

export async function updateMatch(id: string, match: UpdateValues<Match>) {
  const affectedMatch = await Match.findByPk(id);
  return await affectedMatch?.update(match, { where: { match_id: id } });
}

export async function addPlayersToMatch(match_id: string, player_ids: string[]) {
  const match = await Match.findByPk(match_id, { include: [Player] });
  await match?.addPlayers(player_ids);
  return await match?.reload();
}

export async function removePlayersFromMatch(match_id: string, player_ids: string[]) {
  const match = await Match.findByPk(match_id, { include: [Player] });
  await match?.removePlayers(player_ids);
  return await match?.reload();
}

export async function changeMatchPlayers(
  match_id: string,
  playersToAdd: string[],
  playersToRemove: string[],
) {
  const match = await Match.findByPk(match_id, { include: [Player] });
  await match?.removePlayers(playersToRemove);
  await match?.addPlayers(playersToAdd);
  return await match?.reload();
}
