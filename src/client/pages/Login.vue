<script setup lang="ts"></script>
<template>
  <v-container class="bg-surface">
    <v-row>
      <v-spacer />
      <v-col cols="2">
        <v-img
          aspect-ratio="1/1"
          rounded="circle"
          color="deep-purple-darken-4"
          src="https://cdn.discordapp.com/icons/224729241391071233/a_8fb5ede1c8be867343b47e58e1659f31.webp"></v-img>
      </v-col>
      <v-spacer />
    </v-row>
    <v-row>
      <v-spacer />

      <v-col cols="6">
        <v-card
          title="Welcome"
          subtitle="Please login with Discord to continue:"
          rounded="lg"
          variant="tonal"
          max-width="500px"
          class="pa-4 text-center mx-auto">
          <v-btn
            text="Login with Discord"
            size="large"
            rounded="lg"
            elevation="12"
            color="deep-purple-darken-3"
            prepend-icon="fab fa-discord" />

          <v-divider class="ma-2" />

          <div class="d-none d-xs-block">xs</div>
          <div class="d-none d-sm-block">sm</div>
          <div class="d-none d-md-block">md</div>
          <div class="d-none d-lg-block">lg</div>
          <div class="d-none d-xl-block">xl</div>
          <div class="d-none d-xxl-block">xxl</div>
        </v-card>
      </v-col>

      <v-spacer />
    </v-row>
  </v-container>
</template>
