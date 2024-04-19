import { PlayerResponse, MatchResponse } from "./response.js";
import { Outcome } from "./enums.js";

type PlayerParams = Partial<Omit<PlayerResponse, "player_id">>;

type PlayerUpdateRequest = {
  player_id: string;
  player: PlayerParams;
};

type MatchParams = Partial<Omit<MatchResponse, "match_id">>;
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

export { PlayerParams, PlayerUpdateRequest };
export { MatchParams, MatchUpdateRequest, MatchPlayerUpdateValue };
