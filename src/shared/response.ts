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
  round?: typeof Round;
  length?: number;
  vod?: string;
  players?: Partial<PlayerResponse[]>;
  Score?: ScoreResponse;
};

export type ScoreResponse = {
  points?: string;
};
