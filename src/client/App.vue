<script setup lang="ts"></script>
<template>
  <v-app>
    <v-layout class="rounded rounded-md">
      <v-app-bar>
        <v-app-bar-title>
          <router-link to="/" class="text-h5 text-decoration-none"> Kusogrande Match Dashboard </router-link>
        </v-app-bar-title>
        <router-link to="/matches">
          <v-btn color="indigo-accent-1" variant="tonal" text="Matches" class="mx-2" />
        </router-link>
        <router-link to="/players">
          <v-btn color="purple-accent-1" variant="tonal" text="Players" class="mx-2" />
        </router-link>
        <v-btn color="red-accent-1" variant="tonal" text="Files" class="mx-2" />
        <span class="mx-1"></span>
      </v-app-bar>
      <v-main>
        <router-view />
      </v-main>
    </v-layout>
  </v-app>
</template>

<style lang="scss"></style>
