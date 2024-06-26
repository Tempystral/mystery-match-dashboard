<script setup lang="ts">
import { PlayerId, PlayerResponse, PlayerStatusLabel, PlayerUpdateRequest, defaultPlayer } from "@mmd/common";
import { diff } from "deep-object-diff";
import { clone, isEmpty } from "lodash-es";
import { ref, watch } from 'vue';

const props = defineProps<{
  player: PlayerResponse
}>();

const emit = defineEmits<{
  updatePlayer: [value: PlayerUpdateRequest];
}>();

const showDialog = defineModel<boolean>({});

const editedPlayer = ref<PlayerResponse>(defaultPlayer as PlayerResponse);

watch(showDialog, (isShowing) => {
  if (isShowing) {
    // Clone prop to make a distinct player with the same properties
    // Convenient because we can't write to a prop from inside here anyways
    editedPlayer.value = clone(props.player);
  }
})

// Determine what, if any properties have changed and emit a request to update data.
const submit = () => {
  const changedValues = diff(props.player, editedPlayer.value);
  if (!isEmpty(changedValues)) {
    console.log(changedValues);
    emit("updatePlayer", {player_id: props.player.player_id as PlayerId, player: changedValues});
  }
  closeDialog();
}

const closeDialog = () => showDialog.value = false;

const statuses = Object.entries(PlayerStatusLabel).map(e => {return {title: e[1], value: e[0]}});
</script>
<template>
  <v-dialog max-width="800px" v-model="showDialog">
    <v-card rounded="lg">
      <v-card-title>Edit Player</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="6">
            <v-row>
              <v-col>
                <v-text-field
                  label="Twitch name"
                  required
                  v-model="editedPlayer.twitch_name"
                  hide-details
                  @update:model-value="console.log('Player twitch name changed!')"
                  density="compact"
                  variant="outlined"
                  prepend-icon="fab fa-twitch" />
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field
                  label="Twitch alt channel"
                  v-model="editedPlayer.twitch_alt"
                  hide-details
                  density="compact"
                  variant="outlined"
                  prepend-icon="fab fa-twitch" />
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field
                  label="Discord name"
                  required
                  v-model="editedPlayer.discord_name"
                  hide-details
                  density="compact"
                  variant="outlined"
                  prepend-icon="fab fa-discord" />
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field
                  label="Twitter handle"
                  v-model="editedPlayer.twitter_name"
                  hide-details
                  density="compact"
                  variant="outlined"
                  prepend-icon="fab fa-twitter" />
              </v-col>
            </v-row>
          </v-col>
          <v-divider vertical inset></v-divider>
          <v-col>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="Pronouns"
                  v-model="editedPlayer.pronouns"
                  hide-details
                  variant="outlined"
                  prepend-icon="fas fa-user" />
              </v-col>
              <v-col cols="12">
                <v-select
                  label="Status"
                  :items="statuses"
                  v-model="editedPlayer.status"
                  variant="outlined"
                  hide-details
                  class="ms-10" />
              </v-col>
              <v-col cols="12">
                <v-checkbox
                  label="In brackets?"
                  v-model="editedPlayer.in_brackets"
                  hide-details
                  density="compact"
                  class="ms-10" />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-divider />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4">
            <v-text-field label="Timezone" v-model="editedPlayer.timezone" hide-details variant="outlined" />
          </v-col>
          <v-col cols="8">
            <v-text-field
              label="Availability"
              v-model="editedPlayer.availability"
              hide-details
              variant="outlined" />
          </v-col>
          <v-col cols="12">
            <v-textarea
              label="Accessibility Notes"
              rows="2"
              auto-grow
              v-model="editedPlayer.accessibility"
              hide-details
              variant="outlined" />
          </v-col>
          <v-col cols="12">
            <v-textarea
              label="Player Notes"
              rows="2"
              auto-grow
              v-model="editedPlayer.notes"
              hide-details
              variant="outlined" />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" color="error" text="Cancel" @click="closeDialog" />
        <v-btn variant="tonal" color="success" text="Save" @click="submit" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<style lang="scss"></style>
