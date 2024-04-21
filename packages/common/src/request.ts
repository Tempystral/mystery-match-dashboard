import { PlayerResponse, MatchResponse } from "./response.js";
import { Outcome } from "./enums.js";

type PlayerInsertParams = Omit<PlayerResponse, "player_id">;
type PlayerParams = Partial<PlayerInsertParams>;

type PlayerUpdateRequest = {
  player_id: string;
  player: PlayerParams;
};

type MatchInsertParams = Omit<MatchResponse, "match_id">;
type MatchParams = Partial<MatchInsertParams>;
type MatchPlayerUpdateValue = { player_id: string; points?: number; outcome?: Outcome };
type MatchUpdateRequest = {
  match_id: string;
  match: MatchParams;
  players: {
    add: MatchPlayerUpdateValue[];
    update: MatchPlayerUpdateValue[];
    remove: string[];
  };
};

export { PlayerParams, PlayerInsertParams, PlayerUpdateRequest };
export { MatchParams, MatchInsertParams, MatchUpdateRequest, MatchPlayerUpdateValue };
