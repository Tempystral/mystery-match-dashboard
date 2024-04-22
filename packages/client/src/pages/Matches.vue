<script setup lang="ts">
  import { useQuery } from '@tanstack/vue-query';
  import { MatchResponse, PlayerResponse, RoundLabel, defaultMatchResponse, Round } from "@mmd/common"
  import DateFnsAdapter from "@date-io/date-fns";
  import { useDate } from 'vuetify';
  import { api } from '@client/util/httpService';
  import { ref } from 'vue';
  import { useMutateMatch } from '@client/composables/mutations';
  import MatchEditModal from '@client/components/MatchEditModal.vue';
import { useMatchQuery, usePartialPlayers, usePlayerQuery } from '@client/composables/queries';

  const { isPending, data: matches, isRefetching } = useMatchQuery();
  const { error: mutError, mutate, reset } = useMutateMatch();

  const { data: playerData, error: playerError, isLoading: playerLoading } = usePartialPlayers();

  const showDialog = ref(false);
  const editIndex = ref(-1);
  const editedItem = ref<MatchResponse>(defaultMatchResponse as MatchResponse);

  const editMatch = (match: MatchResponse) => {
    if (matches.value != undefined) {
    editIndex.value = matches.value.indexOf(match) ?? -1;
    editedItem.value = Object.assign({}, match);
    showDialog.value = true;
    }
  }

  const dateUtil = useDate() as DateFnsAdapter;
  const formatDate = (item: MatchResponse) => dateUtil.format(item.match.date, "fullDate");

  const deleteMatch = (match: MatchResponse) => { }

  const headers = ref([
    { key: "match.date", title: "Date", value: formatDate },
    { key: "match.game", title: "Game Name" },
    { key: "match.platform", title: "Platform" },
    { key: "match.gamemaster", title: "Gamemaster" },
    { key: "match.round", title: "Round", value: (item: MatchResponse) => RoundLabel[item.match.round ?? Round.UNKNOWN]},
    { key: "match.vod", title: "VOD Link" },
    { key: "actions", title: "Actions", sortable: false },
  ]);
</script>
<template>
  <v-container class="bg-surface-accent">
    <v-card rounded variant="elevated">
      <v-data-table
        :headers="headers"
        :items="matches"
        :loading="isPending || isRefetching"
        loading-text="Loading, please wait...">
        <template #loading>
          <v-skeleton-loader type="table-row@10" />
        </template>

        <template #top>
          <v-toolbar color="indigo" title="Matches"></v-toolbar>
        </template>

        <template #item.match.vod="{ item }">
          <a :href="item.match.vod || ''" class="text-decoration-none">
            Link&nbsp;
            <v-icon icon="fa fa-link" size="tiny" />
          </a>
        </template>

        <template #item.actions="{ item }">
          <v-icon icon="fa fa-edit" size="medium" @click="editMatch(item)" class="me-2" />
          <v-icon icon="fa fa-trash" size="medium" @click="deleteMatch(item)" />
        </template>
      </v-data-table>
    </v-card>

    <match-edit-modal
      :match="editedItem"
      :playerData="playerData"
      :player-error="playerError"
      :is-loading="playerLoading"
      @update-match="mutate($event)"
      v-model="showDialog" />
  </v-container>
</template>
<style lang="scss"></style>
