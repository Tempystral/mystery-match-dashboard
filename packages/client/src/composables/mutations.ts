import { useQueryClient, useMutation } from "@tanstack/vue-query";
import { PlayerUpdateRequest, PlayerResponse } from "@mmd/common";
import { api } from "@client/util/request.js";
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
