import { useQueryClient, useMutation } from "@tanstack/vue-query";
import { PlayerUpdateRequest, PlayerResponse, MatchUpdateRequest, MatchResponse } from "@mmd/common";
import { api } from "@client/util/httpService.js";
export const useMutatePlayer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: PlayerUpdateRequest) => api.patch<PlayerResponse>("/players", request),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["players"] });
    },
    onError(error, variables, context) {
      console.log(error);
    },
  });
};

export const useMutateMatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: MatchUpdateRequest) => api.patch<MatchResponse>("/matches", request),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["matches"] });
    },
    onError(error, variables, context) {
      console.log(error);
    },
  });
};
