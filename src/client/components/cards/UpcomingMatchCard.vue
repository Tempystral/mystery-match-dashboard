<script setup lang="ts">
    import DateFnsUtils from '@date-io/date-fns/build/date-fns-utils';
  import { computed, ref } from 'vue';
    import { useDate } from 'vuetify';

    const date = useDate() as DateFnsUtils;
    const nextMatch = ref(date.date(new Date("March 22, 2024, 2:00 PM EDT")));

    const players = [
      { name: "player1", icon: "fab fa-discord" },
      { name: "player2", icon: "fab fa-discord" },
      { name: "player3", icon: "fab fa-discord" },
      { name: "player4", icon: "fab fa-discord" }
    ];
</script>
<template>
  <v-card rounded color="indigo-darken-3" variant="elevated" title="Next match" :subtitle="`Round ${1}`">
    <v-card-text>
      <div class="text-h4">{{ nextMatch?.toDateString() }}</div>
      <div class="d-flex justify-end">
        <v-sheet rounded color="transparent">
          <div class="text-h5">{{ nextMatch?.toLocaleTimeString() }}</div>
        </v-sheet>
      </div>
    </v-card-text>
    <v-sheet>
      <v-row justify="center" no-gutters>
        <v-col cols="5" class="pa-2">
          <v-label text="Gamemaster"></v-label>
          <v-divider class="ma-1" />
          <p>Tempystral</p>
          <!-- <v-list lines="one" class="fill-height">
          <v-list-subheader title="Gamemaster" />
          <v-list-item title="Tempystral" />
        </v-list> -->
        </v-col>
        <v-col cols="7" class="pa-2">
          <v-label text="Players"></v-label>
          <v-divider class="ma-1" />
          <div class="d-flex-wrap justify-center">
            <v-chip v-for="(player, i) in players" :key="i" class="ma-1">{{ player.name }}</v-chip>
          </div>
        </v-col>
      </v-row>
    </v-sheet>
  </v-card>
</template>
<style lang="scss"></style>
