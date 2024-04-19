import { Outcome } from "./enums.js";
import { PlayerStatus, Round } from "./enums.js";

interface PlayerDetails {
  player_id: string;
  twitch_name: string;
  twitch_alt: string | null;
  discord_name: string;
  twitter_name: string | null;
  in_brackets: boolean;
  status: PlayerStatus;
  pronouns: string | null;
}

interface PlayerPersonalDetails {
  pronunciation_notes: string | null;
  accessibility: string | null;
  timezone: string | null;
  availability: string | null;
  notes: string | null;
}

type PlayerResponse = PlayerDetails & PlayerPersonalDetails;

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

export { PlayerDetails, PlayerPersonalDetails, PlayerResponse, PlayerResponseGroup, defaultPlayer };
export { MatchResponse, MatchResponseGroup, defaultMatchResponse };
export { ScoreResponse, defaultScoreResponse };
