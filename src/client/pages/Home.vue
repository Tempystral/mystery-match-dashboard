<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import { MatchResponse } from '../../shared/models';
import UpcomingMatchCard from '../components/cards/UpcomingMatchCard.vue';

const fetchMatches = async (): Promise<MatchResponse[]> =>
  await fetch("http://localhost:3000/matches",
    {
      mode: 'cors',
      method: "get",
    }).then(response => response.json());

const { isLoading, data: matches, } = useQuery({
  queryKey: ["matches"],
  queryFn: fetchMatches
})

</script>
<template>
  <v-container fluid class="bg-surface-accent fill-height align-start">
    <v-row>
      <v-col cols="4">
        <v-card rounded variant="flat" color="deep-purple-darken-1">A panel</v-card>
      </v-col>
      <v-col cols="4">
        <v-card rounded>Another panel</v-card>
      </v-col>
      <v-col cols="4">
        <v-card v-if="isLoading" title="Next Match" subtitle="Loading...">
          <v-skeleton-loader type="card"></v-skeleton-loader>
        </v-card>
        <UpcomingMatchCard v-else-if="matches" :match="matches[0]" />
      </v-col>
    </v-row>
  </v-container>
</template>
<style lang="scss"></style>
