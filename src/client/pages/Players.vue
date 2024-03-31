<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import { ref } from 'vue';
import { PlayerResponse } from '../../shared/models';
import { PlayerStatusLabel } from '../../shared/types';

const fetchPlayers = async (): Promise<PlayerResponse[]> =>
  await fetch("http://localhost:3000/players",
    {
      mode: 'cors',
      method: "get",
    }).then(response => response.json());

const { isPending, isError, isFetching, data, error, refetch } = useQuery({
  queryKey: ["players"],
  queryFn: fetchPlayers
})

const editItem = (player: PlayerResponse) => { }
const deleteItem = (player: PlayerResponse) => { }

const headers = ref([
  { key: "twitch_name", title: "Twitch" },
  { key: "twitch_alt", title: "Alt?" },
  { key: "discord_name", title: "Discord" },
  { key: "status", title: "Status", value: (item: PlayerResponse) => PlayerStatusLabel[item.status] },
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
                    :items="data"
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
          <v-icon icon="fa fa-edit" size="medium" @click="editItem(item)" class="me-2" />
          <v-icon icon="fa fa-trash" size="medium" @click="deleteItem(item)" />
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>
<style lang="scss"></style>
../../shared/data
