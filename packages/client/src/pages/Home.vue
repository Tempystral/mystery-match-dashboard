<script setup lang="ts">
  import { api } from '@client/util/request.js';
  import { useQuery } from '@tanstack/vue-query';
  import { MatchResponse, PlayerResponse } from "@mmd/common"
  import UpcomingMatchCard from '../components/cards/UpcomingMatchCard.vue';

  const { isLoading: matchesLoading, data: matches, } = useQuery({
    queryKey: ["matches"],
    queryFn: () => api.get<MatchResponse[]>("matches", {})
  });
</script>
<template>
  <v-container fluid class="bg-surface-accent fill-height align-start">
    <v-row>
      <v-col cols="4">
        <v-card rounded variant="flat" color="deep-purple-darken-1">A panel</v-card>
      </v-col>
      <v-col cols="4"> </v-col>
      <v-col cols="4">
        <v-card v-if="matchesLoading" title="Next Match" subtitle="Loading...">
          <v-skeleton-loader type="card"></v-skeleton-loader>
        </v-card>
        <UpcomingMatchCard v-else-if="matches" :match="matches[0]" />
      </v-col>
    </v-row>
  </v-container>
</template>
<style lang="scss"></style>
