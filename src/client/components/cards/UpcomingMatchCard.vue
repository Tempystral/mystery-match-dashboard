<script setup lang="ts">
import DateFnsUtils from '@date-io/date-fns/build/date-fns-utils';
import { ref } from 'vue';
import { useDate } from 'vuetify';
import { MatchResponse } from '../../../shared/models';
import { capitalize } from "@client/util/utils.js"

const dateUtil = useDate() as DateFnsUtils;

function toDateString(date: Date) {
  return dateUtil.date(date)?.toDateString();
}

function toTimeString(date: Date) {
  return dateUtil.date(date)?.toLocaleTimeString();
}

const props = defineProps<{
  match: MatchResponse
}>();
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
          <span class="text-h5">{{ capitalize(match.gamemaster) }}</span>
        </v-col>
        <v-col cols="7" class="pa-2">
          <v-label text="Players"></v-label>
          <v-divider class="ma-1" />
          <div class="d-flex-wrap justify-center">
            <v-chip
                    v-if="match.players"
                    v-for="(player, i) in match.players"
                    :key="i"
                    link
                    color="indigo-accent-1"
                    class="ma-1"
                    append-icon="fab fa-twitch">
              {{ player?.twitch_name }}
            </v-chip>
          </div>
        </v-col>
      </v-row>
    </v-sheet>
  </v-card>
</template>
<style lang="scss"></style>
