import { PlayerStatus, Round } from "./types.js";

export type PlayerResponse = {
  player_id: string;
  twitch_name: string;
  twitch_alt?: string;
  discord_name: string;
  twitter_name?: string;
  in_brackets: boolean;
  status: PlayerStatus;
  pronunciation_notes: string;
  pronouns: string;
  accessibility: string;
  timezone: string;
  availability: string;
  notes: string;
  matches: Partial<MatchResponse[]>;
  Score: ScoreResponse;
  total_score: number;
};

export type PlayerUpdateRequest = {
  player_id: string;
  player: Partial<Omit<PlayerResponse, "player_id">>;
};

export const defaultPlayer: PlayerResponse = {
  player_id: "",
  twitch_name: "",
  twitch_alt: "",
  discord_name: "",
  twitter_name: "",
  in_brackets: false,
  status: PlayerStatus.ACTIVE,
  pronunciation_notes: "",
  pronouns: "",
  accessibility: "",
  timezone: "",
  availability: "",
  notes: "",
  matches: [],
  Score: {},
  total_score: 0,
};

export type MatchResponse = {
  match_id: string;
  tournament: string;
  date: Date;
  game?: string;
  platform?: string;
  gamemaster?: string;
  round?: Round;
  length?: number;
  vod?: string;
  players?: Partial<PlayerResponse[]>;
  Score?: ScoreResponse;
};

export const defaultMatchResponse = {
  match_id: "",
  tournament: "",
  date: new Date(0),
  game: undefined,
  platform: undefined,
  gamemaster: undefined,
  round: undefined,
  length: undefined,
  vod: undefined,
  players: undefined,
  Score: undefined,
};

export type MatchUpdateRequest = {
  match_id: string;
  match: Partial<Omit<MatchResponse, "match_id">>;
};

export type ScoreResponse = {
  points?: string;
};
