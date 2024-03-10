<script setup lang="ts">
  import UpcomingMatchCard from '../components/cards/UpcomingMatchCard.vue';
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
        <UpcomingMatchCard />
      </v-col>
    </v-row>
  </v-container>
</template>
<style lang="scss"></style>
