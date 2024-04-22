import { api } from "@client/util/httpService";
import {
  MatchResponse,
  PlayerDetails,
  PlayerExtras,
  PlayerPersonalDetails,
  PlayerResponse,
  PlayerSearchParams,
} from "@mmd/common";
import { skipToken, useQuery } from "@tanstack/vue-query";
import { MaybeRef } from "vue";

export function usePlayerQuery<T = PlayerResponse[]>(options?: {
  params?: PlayerSearchParams;
  enabled?: MaybeRef<object>;
}) {
  const { params, enabled } = options ?? {};
  const keys = params ? (Object.keys(params) as (keyof PlayerSearchParams)[]) : [];
  const query = keys.length && params ? "?" + keys.map((k) => `${k}=${params[k]}`).join("&") : "";
  return useQuery({
    queryFn: enabled ? () => api.get<T>(`/players${query}`, {}) : skipToken,
    queryKey: ["players", ...keys],
  });
}

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
