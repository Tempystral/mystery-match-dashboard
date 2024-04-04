<script setup lang="ts">
  import { api } from '@client/util/request.js';
  import { useMutation, useQuery } from '@tanstack/vue-query';
  import { ref } from 'vue';
  import { PlayerResponse, PlayerUpdateRequest, defaultPlayer } from "@mmd/common"
  import { PlayerStatus, PlayerStatusLabel } from "@mmd/common"
  import PlayerEditModal from "../components/PlayerEditModal.vue";
  import { useMutatePlayer } from "../composables/mutations"

  const { isPending, data: players } = useQuery({
    queryKey: ["players"],
    queryFn: () => api.get<PlayerResponse[]>("/players", {})
  });

  const { error: mutError, mutate, reset } = useMutatePlayer();

  const showDialog = ref(false);
  const editIndex = ref(-1);
  const editedItem = ref<PlayerResponse>(defaultPlayer as PlayerResponse);

  const editPlayer = (player: PlayerResponse) => {
    if (players.value != undefined) {
    editIndex.value = players.value.indexOf(player) ?? -1;
    editedItem.value = Object.assign({}, player);
    showDialog.value = true;
    }
  }
  const deletePlayer = (player: PlayerResponse) => { }

  const headers = ref([
    { key: "twitch_name", title: "Twitch" },
    { key: "twitch_alt", title: "Alt?" },
    { key: "discord_name", title: "Discord" },
    { key: "status", title: "Status", value: (item: PlayerResponse) => PlayerStatusLabel[item.status as PlayerStatus] },
    { key: "in_brackets", title: "In Brackets?" },
    { key: "matches", title: "Matches Played", value: (item: PlayerResponse) => item.matches?.length },
    { key: "total_score", title: "Total Points" },
    { key: "actions", title: "Actions", sortable: false },
  ]);
</script>
<template>
  <v-container class="bg-surface-accent">
    <v-card rounded variant="elevated">
      <v-data-table
        :headers="headers"
        :items="players"
        :loading="isPending"
        loading-text="Loading, please wait...">
        <template #loading>
          <v-skeleton-loader type="table-row@10" />
        </template>

        <template #top>
          <v-toolbar color="amber-darken-1" title="Players"></v-toolbar>
        </template>

        <template #item.in_brackets="{ item }">
          <v-icon :icon="item.in_brackets ? 'fa fa-check' : 'fa fa-x'" size="medium" class="text-center" />
        </template>

        <template #item.actions="{ item }">
          <v-tooltip text="View matches" location="top">
            <template #activator="{ props }">
              <v-icon icon="fa fa-gamepad" size="medium" @click="" class="me-3" v-bind="props" />
            </template>
          </v-tooltip>
          <v-tooltip text="Edit player" location="top">
            <template #activator="{ props }">
              <v-icon icon="fa fa-edit" size="medium" @click="editPlayer(item)" class="me-2" v-bind="props" />
            </template>
          </v-tooltip>
          <v-tooltip text="Delete player" location="top">
            <template #activator="{ props }">
              <v-icon icon="fa fa-trash" size="medium" @click="deletePlayer(item)" v-bind="props" />
            </template>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-card>

    <PlayerEditModal :player="editedItem" @updatePlayer="mutate($event)" v-model="showDialog" />
  </v-container>
</template>
<style lang="scss"></style>
