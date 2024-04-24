<script setup lang="ts">
import { api } from '@client/util/httpService.js';
import UpcomingMatchCard from '../components/cards/UpcomingMatchCard.vue';
import { useMatchQuery } from '@client/composables/queries';

const { isLoading: matchesLoading, data: matches, } = useMatchQuery({ limit: 4 });
</script>
<template>
  <v-container fluid class="bg-surface-accent fill-height align-start">
    <v-row>
      <v-col cols="4">
        <v-card rounded variant="flat" color="deep-purple-darken-1">
          <v-btn text="Clear data" class="ma-2" @click="() => api.get<void>('/clear', {})" />
          <v-btn text="Import players" class="ma-2" @click="() => api.get<void>('/players/import', {})" />
          <v-btn text="Import matches" class="ma-2" @click="() => api.get<void>('/matches/import', {})" />
        </v-card>
      </v-col>
      <v-col cols="4"> </v-col>
      <v-col cols="4">
        <v-card v-if="matchesLoading" title="Next Match" subtitle="Loading...">
          <v-skeleton-loader type="card"></v-skeleton-loader>
        </v-card>
        <UpcomingMatchCard v-else-if="matches" :match="matches[0].match" />
      </v-col>
    </v-row>
  </v-container>
</template>
<style lang="scss"></style>
