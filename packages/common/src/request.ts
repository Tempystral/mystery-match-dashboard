import { Outcome } from "./enums.js";
import { MatchData, PlayerDetails, PlayerResponse } from "./response.js";
import { MatchId, PlayerId } from "./types.js";

type PlayerInsertParams = Omit<PlayerResponse, "player_id">;
type PlayerSearchParams = Partial<PlayerDetails> & { match_id?: MatchId };
type PlayerUpdateParams = Partial<PlayerInsertParams>;

type PlayerUpdateRequest = {
  player_id: PlayerId;
  player: PlayerUpdateParams;
};

type MatchInsertParams = Omit<MatchData, "match_id">;
type MatchSearchParams = Partial<MatchData> & { limit?: number };
type MatchPlayerUpdateValue = { player_id: PlayerId; points?: number; outcome?: Outcome };
type MatchUpdateRequest = {
  match_id: MatchId;
  match: Partial<MatchInsertParams>;
  players: {
    add: MatchPlayerUpdateValue[];
    update: MatchPlayerUpdateValue[];
    remove: PlayerId[];
  };
};

export {
  MatchInsertParams,
  MatchSearchParams,
  MatchPlayerUpdateValue,
  MatchUpdateRequest,
  PlayerInsertParams,
  PlayerSearchParams,
  PlayerUpdateParams,
  PlayerUpdateRequest,
};
