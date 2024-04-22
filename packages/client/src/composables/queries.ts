import { api } from "@client/util/httpService";
import {
  MatchResponse,
  PlayerDetails,
  PlayerExtras,
  PlayerPersonalDetails,
  PlayerResponse,
  PlayerSearchParams,
} from "@mmd/common";

export function usePartialPlayers() {
  return useQuery({
    queryFn: () => api.get<(PlayerDetails & Partial<PlayerExtras>)[]>("/players/partial", {}),
    queryKey: ["players", "partial"],
  });
}

export function useMatchQuery() {
  return useQuery({
    queryKey: ["matches"],
    queryFn: () => api.get<MatchResponse[]>("/matches", {}),
  });
}
