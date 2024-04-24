<script setup lang="ts">
import DateFnsUtils from '@date-io/date-fns/build/index.js';
import { useDate } from 'vuetify';
import { MatchData, PlayerInMatch } from "@mmd/common"
import { capitalize } from "@client/util/utils.js"
import { usePlayerQuery } from '@client/composables/queries';
import { ref } from 'vue';

const dateUtil = useDate() as DateFnsUtils;

function toDateString(date: Date) {
  return dateUtil.date(date)?.toDateString();
}

function toTimeString(date: Date) {
  return dateUtil.date(date)?.toLocaleTimeString();
}

const props = defineProps<{
  match: MatchData
}>();

const { data: players, isLoading } = usePlayerQuery<PlayerInMatch[]>({ params: { match_id: props.match.match_id }, enabled: ref(true) });
</script>
<template>
  <v-card rounded color="indigo-darken-3" variant="elevated" title="Next match" :subtitle="`Round ${1}`">
    <v-card-text>
      <div class="text-h4">{{ toDateString(match.date) }}</div>
      <div class="d-flex justify-end">
        <v-sheet rounded color="transparent">
          <div class="text-h5">{{ toTimeString(match.date) }}</div>
        </v-sheet>
      </div>
    </v-card-text>
    <v-sheet>
      <v-row justify="center" no-gutters>
        <v-col cols="5" class="pa-2">
          <v-label text="Gamemaster"></v-label>
          <v-divider class="ma-1" />
          <span class="text-h5">{{ capitalize(match.gamemaster ?? "") }}</span>
        </v-col>
        <v-col cols="7" class="pa-2">
          <v-label text="Players"></v-label>
          <v-divider class="ma-1" />
          <div class="d-flex-wrap justify-center" v-if="players && !isLoading">
            <v-chip
              v-for="{ player } in players"
              :key="player.player_id"
              link
              color="indigo-accent-1"
              class="ma-1"
              append-icon="fab fa-twitch">
              {{ player.twitch_name }}
            </v-chip>
          </div>
        </v-col>
      </v-row>
    </v-sheet>
  </v-card>
</template>
<style lang="scss"></style>
