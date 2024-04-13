import { PlayerResponse, MatchResponse } from "./response.js";
import { Outcome } from "./types.js";

type PlayerUpdateRequest = {
  player_id: string;
  player: Partial<Omit<PlayerResponse, "player_id">>;
};

type MatchPlayerUpdateValue = { player_id: string; points?: number; outcome?: Outcome };
type MatchUpdateRequest = {
  match_id: string;
  match: Partial<Omit<MatchResponse, "match_id" | "players" | "scores">>;
  players: {
    add: MatchPlayerUpdateValue[];
    update: MatchPlayerUpdateValue[];
    remove: string[];
  };
};

export { PlayerUpdateRequest };
export { MatchUpdateRequest, MatchPlayerUpdateValue };
