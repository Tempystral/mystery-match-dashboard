import { Outcome } from "./enums.js";
import { PlayerStatus, Round } from "./enums.js";
import { MatchId, PlayerId, ScoreId } from "./types.js";

interface PlayerDetails {
  player_id: string;
  twitch_name: string;
  discord_name: string;
  // Discord ID?
  in_brackets: boolean;
  status: PlayerStatus;
  pronouns: string | null;
}

interface PlayerPersonalDetails {
  twitch_alt: string | null;
  twitter_name: string | null;
  pronunciation_notes: string | null;
  accessibility: string | null;
  timezone: string | null;
  availability: string | null;
  notes: string | null;
}

interface PlayerExtras {
  total_score: number;
  matches_played: number;
}

type PlayerResponse = PlayerDetails & PlayerPersonalDetails & Partial<PlayerExtras>;

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
};

type MatchResponse = {
  match_id: string;
  tournament: string;
  date: Date;
  game: string | null;
  platform: string | null;
  gamemaster: string | null;
  round: Round;
  length: number;
  vod: string | null;
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
};

type ScoreMetadata = {
  points: number;
  outcome: Outcome;
};
type ScoreResponse = ScoreMetadata & {
  score_id: ScoreId;
  match_id: MatchId;
  player_id: PlayerId;
};

const defaultScoreResponse: ScoreResponse = {
  score_id: "" as ScoreId,
  player_id: "" as PlayerId,
  match_id: "" as MatchId,
  points: 0,
  outcome: Outcome.SCORE,
};

type PlayerInMatch = {
  player: PlayerDetails;
  score: ScoreMetadata | null;
};

export { PlayerDetails, PlayerPersonalDetails, PlayerResponse, PlayerInMatch, defaultPlayer };
export { MatchResponse, MatchResponseGroup, defaultMatchResponse };
export { ScoreResponse, defaultScoreResponse };
