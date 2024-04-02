<script setup lang="ts">
  import DateFnsUtils from '@date-io/date-fns/build/date-fns-utils';
  import { useQuery } from '@tanstack/vue-query';
  import { ref } from 'vue';
  import { MatchResponse } from '../../shared/response';
  import { useDate } from 'vuetify/lib/framework.mjs';

  const dateUtil = useDate() as DateFnsUtils;

  const fetchMatches = async (): Promise<MatchResponse[]> =>
    await fetch("http://localhost:3000/matches",
      {
        mode: 'cors',
        method: "get",
      }).then(response => response.json());

  const { isPending, isError, isFetching, data: matches, error, refetch } = useQuery({
    queryKey: ["matches"],
    queryFn: fetchMatches
  })

  const formatDate = (item: MatchResponse) => dateUtil.format(item.date, "fullDate");

  const editItem = (player: MatchResponse) => { }
  const deleteItem = (player: MatchResponse) => { }

  const headers = ref([
    { key: "date", title: "Date", value: formatDate },
    { key: "game", title: "Game Name" },
    { key: "platform", title: "Platform" },
    { key: "gamemaster", title: "Gamemaster" },
    { key: "round", title: "Round" },
    { key: "vod", title: "VOD Link" },
    { key: "actions", title: "Actions", sortable: false },
  ]);
</script>
<template>
  <v-container class="bg-surface-accent">
    <v-card rounded variant="elevated">
      <v-data-table
        :headers="headers"
        :items="matches"
        show-select
        select-strategy="single"
        item-selectable="match_id"
        return-object
        :loading="isPending"
        loading-text="Loading, please wait...">
        <template #loading>
          <v-skeleton-loader type="table-row@10" />
        </template>

        <template #top>
          <v-toolbar color="indigo" title="Matches"></v-toolbar>
        </template>

        <template #item.vod="{ item }">
          <a :href="item.vod" class="text-decoration-none"
            >Link&nbsp;<v-icon icon="fa fa-link" size="tiny"
          /></a>
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
