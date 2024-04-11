import { Outcome } from "./types.js";
import { PlayerStatus, Round } from "./types.js";

type PlayerResponse = {
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
  matches: Partial<MatchResponse>[];
  Match?: Partial<MatchResponse>;
  Score?: ScoreResponse;
  total_score: number;
};

type PlayerUpdateRequest = {
  player_id: string;
  player: Partial<Omit<PlayerResponse, "player_id">>;
};

const defaultPlayer: PlayerResponse = {
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
  total_score: 0,
};

type MatchResponse = {
  match_id: string;
  tournament: string;
  date: Date;
  game: string;
  platform: string;
  gamemaster: string;
  round: Round;
  length: number;
  vod: string;
  players: PlayerResponse[]; // This field is marked as optional in models.ts but an empty list does actually get created when there's no data
  scores?: ScoreResponse[];
  Score?: ScoreResponse;
};

type MatchResponseGroup = Record<string, MatchResponse>;
type PlayerResponseGroup = Record<string, PlayerResponse>;

const defaultMatchResponse: MatchResponse = {
  match_id: "",
  tournament: "",
  date: new Date(0),
  game: undefined,
  platform: "",
  gamemaster: "",
  round: Round.UNKNOWN,
  length: 1,
  vod: "",
  players: [],
  scores: [],
};

type MatchUpdateRequest = {
  match_id: string;
  match: Partial<Omit<MatchResponse, "match_id" | "players" | "scores">>;
  players?: {
    set: { player_id: string; points?: number; outcome?: Outcome }[];
    remove: string[];
  };
};

type ScoreResponse = {
  score_id: string;
  player_id: string;
  points: number;
  outcome: Outcome;
};

const defaultScoreResponse: ScoreResponse = {
  score_id: "",
  player_id: "",
  points: 0,
  outcome: Outcome.SCORE,
};

export { PlayerResponse, PlayerResponseGroup, PlayerUpdateRequest, defaultPlayer };
export { MatchResponse, MatchResponseGroup, MatchUpdateRequest, defaultMatchResponse };
export { ScoreResponse, defaultScoreResponse };
