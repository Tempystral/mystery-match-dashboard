import { Outcome } from "./enums.js";
import { PlayerStatus, Round } from "./enums.js";
import { MatchId, PlayerId, ScoreId } from "./types.js";

interface PlayerDetails {
  player_id: PlayerId;
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
type MinimalPlayerResponse = PlayerDetails & Partial<PlayerExtras>;

const defaultPlayer: PlayerResponse = {
  player_id: "" as PlayerId,
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

type MatchData = {
  match_id: MatchId;
  tournament: string;
  date: Date;
  game: string | null;
  platform: string | null;
  gamemaster: string | null;
  round: Round;
  length: number;
  vod: string | null;
};

type MatchResponse = {
  match: MatchData;
  scores: ScoreResponse[];
};

const defaultMatchResponse: MatchResponse = {
  match: {
    match_id: "" as MatchId,
    tournament: "",
    date: new Date(0),
    game: undefined,
    platform: "",
    gamemaster: "",
    round: Round.UNKNOWN,
    length: 1,
    vod: "",
  },
  scores: [],
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

export {
  PlayerDetails,
  PlayerPersonalDetails,
  PlayerResponse,
  PlayerExtras,
  MinimalPlayerResponse,
  PlayerInMatch,
  defaultPlayer,
};
export { MatchResponse, MatchData, defaultMatchResponse };
export { ScoreResponse, ScoreMetadata, defaultScoreResponse };
