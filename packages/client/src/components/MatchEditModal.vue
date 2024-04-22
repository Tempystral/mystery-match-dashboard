<script setup lang="ts">
import { detailedDiff, diff } from "deep-object-diff";
import { clone, isEmpty } from "lodash-es";
import { ref, toRaw, watch, computed } from 'vue';
import { MatchResponse, MatchUpdateRequest, MatchPlayerUpdateValue, defaultMatchResponse, RoundLabel, PlayerResponse, ScoreResponse, defaultScoreResponse, MatchId, PlayerInMatch, PlayerId, PlayerPersonalDetails, PlayerDetails, PlayerExtras, defaultPlayer } from "@mmd/common"
import DateFnsAdapter from "@date-io/date-fns";
import VueDatePicker from "@vuepic/vue-datepicker";
import '@vuepic/vue-datepicker/dist/main.css';
import { extractTime } from "@client/util/utils";
import { useDateTime } from "@client/composables/dateTime";
import { usePlayerQuery } from "@client/composables/queries";
import { MinimalPlayerResponse, MatchData } from "@mmd/common";

const props = defineProps<{
  match: MatchResponse,
  playerData?: MinimalPlayerResponse[],
  isLoading: boolean,
  playerError: Error | null
}>();

const emit = defineEmits<{
  updateMatch: [value: MatchUpdateRequest];
}>();

const showDialog = defineModel<boolean>({ default: false });
function closeDialog(){
  showDialog.value = false;
}

/* Match values */
const editedMatch = ref<MatchData>(defaultMatchResponse.match);
const selectedPlayers = ref<MinimalPlayerResponse[]>([]);
//const { data: matchPlayers } = usePlayerQuery<PlayerInMatch[]>({ params: { match_id: props.match.match_id as MatchId }, enabled: showDialog });

const { dateUtil, dateModel, timeModel, editedDateTime } = useDateTime<DateFnsAdapter>();
const rounds = Object.entries(RoundLabel).map(e => {return {title: e[1], value: e[0]}});
const maxAllowedPlayers = computed(() => editedMatch.value.round.match(/GROUP|TIE|UNKNOWN/) ? 4 : 2);

/* Player values */
const playerScores = ref(new Map<PlayerId, ScoreResponse>());
const playerPanelOpen = ref("");

watch(selectedPlayers, newPlayers => {
  while (newPlayers.length > maxAllowedPlayers.value) {
    newPlayers.pop(); // Reduce allowed amount to 4
  }
  /* const struct = newPlayers?.map(p => (
    {
      player: p, // The initial players come from the match so they have a Score association
      score: { ... defaultScoreResponse } // But new players from the player list don't! Set one!
    })
  ) ?? [];
  playerScores.value = Array.from({...struct, length: maxAllowedPlayers.value}); */

  playerScores.value = new Map(newPlayers.map(p =>
    [p.player_id, playerScores.value.get(p.player_id) ?? {...defaultScoreResponse}]
  ));
});

const paddedSelectedPlayers = computed(() => Array.from({...selectedPlayers.value, length: maxAllowedPlayers.value}));

watch(() => playerScores.value.keys(), (oldKeys, newKeys) => {
  for (const key of oldKeys) {
    const oldValue = playerScores.value.get(key);
    if (oldValue) {
      playerScores.value.set(key, oldValue);
    }
  }
});

function adjustScore(id: PlayerId, diff: number) {
  const score = playerScores.value.get(id)!; // This will always be present
  score.points += diff;
  playerScores.value.set(id, score);
}

// Initialize and clean up values on hide/show
watch(showDialog, (isShowing) => {
  isShowing ? setDefaults() : clear();
})

function setDefaults() {
  // Setup split time values
  editedMatch.value = clone(props.match.match);
  playerScores.value = new Map(props.match.scores.map(score => (
    [score.player_id, clone(score)]
  )));
  selectedPlayers.value = props.match.scores.map(score =>
    props.playerData?.find(p => p.player_id === score.player_id) ?? defaultPlayer
  ).sort((a, b) => a.twitch_name.localeCompare(b.twitch_name));

  dateModel.value = editedMatch.value.date;
  timeModel.value = extractTime(editedMatch.value.date);

  playerPanelOpen.value = playerScores.value.size ? `players` : ``
}

function clear() {
  editedMatch.value = defaultMatchResponse.match;
  dateModel.value = new Date();
  timeModel.value = {hours: 0, minutes: 0, seconds: 0};
  playerScores.value.clear();
}

function toChangedValues(p: PlayerInMatch): MatchPlayerUpdateValue {
  return {
    player_id: p.player.player_id as PlayerId,
    points: p.score?.points,
    outcome: p.score?.outcome
  }
}

// Determine what, if any properties have changed and emit a request to update data.
/* function submit() {
  // Get rid of the values we don't want to compare
  const eMatch = toRaw(editedMatch.value)
  const oMatch = toRaw(props.match)
  const oPlayers = toRaw(matchPlayers.value ?? []);
  // Fix date-as-string from backend breaking comparisons
  oMatch.date = dateUtil.date(oMatch.date);
  eMatch.date = dateUtil.date(editedDateTime.value);

  // Compare match data
  const request: MatchUpdateRequest = {
    match_id: props.match.match_id,
    match: diff(oMatch, eMatch) as Partial<MatchResponse>,
    players: {
      add: [],
      update: [],
      remove: []
    }
  }

  // Build lists of minimal player information for comparison
  const originalPlayers = oPlayers.map(p => toChangedValues(toRaw(p)));
  const finalPlayers = new Map<string, MatchPlayerUpdateValue>(playerScores.value
    .filter((p): p is PlayerAndScore => p != undefined)
    //.map(p => ({ ...toRaw(p.player), Score: toRaw(p.score) }) ) // deep-equals doesn't understand reactive proxies
    .map(p => ( [ p.player.player_id, toChangedValues(toRaw(p)) ] ))
  );

  // Find players in the original list NOT in the final one
  originalPlayers.forEach(original => {
    const final = finalPlayers.get(original.player_id);
    if (final) { // If an element is present in both lists
      if (!isEmpty(diff(original, final))) { // And it's modified
        request.players.update.push(final); // Add it to the added list
      } // In either case, remove from finalPlayers since it's been counted
      finalPlayers.delete(original.player_id);
    } else { // If it's not in the final list, remove it
      request.players.remove.push(original.player_id);
    }
  }); // Any values not counted are in the final list but not the original
  request.players.add.push(...Array.from(finalPlayers.values()));

  if (!isEmpty(request.match) || request.players ) {
    //console.log(request);
    emit("updateMatch", request);
  }
  closeDialog();
} */
</script>
<template>
  <v-dialog max-width="800px" v-model="showDialog">
    <v-card rounded="lg">
      <v-card-title>Edit Match</v-card-title>
      <v-card-text>
        <v-row justify="center">
          <v-col cols="6">
            <div id="left-side">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    label="Gamemaster"
                    required
                    v-model="editedMatch.gamemaster"
                    density="compact"
                    variant="outlined"
                    prepend-icon="fas fa-user" />
                  <v-text-field
                    label="Game"
                    required
                    v-model="editedMatch.game"
                    density="compact"
                    variant="outlined"
                    prepend-icon="fas fa-gamepad" />
                  <v-text-field
                    label="Platform"
                    required
                    v-model="editedMatch.platform"
                    density="compact"
                    variant="outlined"
                    prepend-icon="fas fa-computer" />
                </v-col>
              </v-row>
            </div>
          </v-col>
          <v-col cols="6">
            <v-row>
              <v-col cols="12">
                <VueDatePicker
                  v-model="dateModel"
                  :is24="false"
                  :clearable="false"
                  text-input
                  dark
                  partial-flow
                  :enable-time-picker="false"
                  menu-class-name="elevation-18"
                  class="mb-vdp">
                  <template #dp-input="{ value, onEnter }">
                    <v-text-field
                      label="Date"
                      required
                      hide-details
                      :model-value="value"
                      @keydown.enter="onEnter"
                      density="compact"
                      variant="outlined"
                      prepend-icon="fas fa-calendar-days" />
                  </template>
                </VueDatePicker>
                <VueDatePicker
                  v-model="timeModel"
                  :is24="false"
                  :clearable="false"
                  text-input
                  dark
                  partial-flow
                  time-picker
                  menu-class-name="elevation-18"
                  class="mb-vdp">
                  <template #dp-input="{ value, onEnter }">
                    <v-text-field
                      label="Time"
                      required
                      hide-details
                      :model-value="value"
                      @keydown.enter="onEnter"
                      density="compact"
                      variant="outlined"
                      prepend-icon="fas fa-clock" />
                  </template>
                </VueDatePicker>
                <v-select
                  label="Round"
                  required
                  :items="rounds"
                  v-model="editedMatch.round"
                  density="compact"
                  variant="outlined"
                  class="ms-10 mb-4" />
                <!-- <div class="text-caption ms-10">Length (Hours)</div> -->
                <v-slider
                  :min="1"
                  :max="2"
                  :step="1"
                  :tick-size="4"
                  :ticks="{ 1: '1 Hour', 2: '2 Hours' }"
                  show-ticks="always"
                  v-model="editedMatch.length">
                  <template #prepend>
                    <v-icon class="ms-n2" icon="fas fa-stopwatch" />
                    <div class="text-label ms-4 me-2">Length (Hours)</div>
                  </template>
                </v-slider>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider class="mx-4 mb-2" />

      <v-expansion-panels v-model="playerPanelOpen" flat>
        <v-expansion-panel title="Players" value="players">
          <template #title>
            <v-card-title>Players</v-card-title>
          </template>
          <template #text>
            <v-card-text>
              <v-row>
                <v-col>
                  <v-combobox
                    label="Players in match"
                    variant="outlined"
                    :loading="isLoading"
                    v-model="selectedPlayers"
                    :items="playerData ?? []"
                    item-title="twitch_name"
                    :item_props="true"
                    return-object
                    multiple
                    chips>
                  </v-combobox>
                </v-col>
              </v-row>
              <v-divider v-if="selectedPlayers" class="mx-12 mb-6" />
              <v-row>
                <v-col
                  cols="6"
                  v-for="player, index in paddedSelectedPlayers"
                  :key="`${player?.player_id}-${index}`"
                  :id="`player-${player?.player_id}-${index}`">
                  <v-card
                    v-if="player"
                    variant="elevated"
                    color="light-blue-darken-4"
                    elevation="8"
                    class="pa-2">
                    <v-row>
                      <v-col cols="8" align-self="center">
                        <v-label class="mx-2 font-weight-bold">
                          {{ player.twitch_name }}
                        </v-label>
                        <v-chip
                          v-if="player.pronouns"
                          :text="player.pronouns"
                          size="small"
                          variant="flat"
                          color="white" />
                      </v-col>
                      <v-col>
                        <!-- This field should change if the match type / outcome is not a score type -->
                        <v-text-field
                          :model-value="playerScores.get(player.player_id)?.points"
                          hide-details
                          variant="outlined"
                          label="Score">
                          <template #append-inner>
                            <div class="d-flex flex-column justify-center">
                              <v-icon
                                icon="fas fa-chevron-up"
                                size="tiny"
                                role="button"
                                aria-label="Increase Score"
                                class="icon-hover"
                                @click="adjustScore(player.player_id, 1)" />
                              <v-icon
                                icon="fas fa-chevron-down"
                                size="tiny"
                                role="button"
                                aria-label="Decrease Score"
                                class="icon-hover"
                                @click="adjustScore(player.player_id, -1)" />
                            </div>
                          </template>
                        </v-text-field>
                      </v-col>
                    </v-row>
                  </v-card>
                  <v-card v-else variant="outlined" class="pa-6">&nbsp;</v-card>
                </v-col>
              </v-row>
            </v-card-text>
          </template>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" color="error" text="Cancel" @click="closeDialog" />
        <v-btn variant="tonal" color="success" text="Save" @click="" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<style lang="scss">
.dp__input_wrap {
  .v-field__input {
    min-height: unset;
  }

  .v-field--variant-outlined{
    .v-field__outline__notch::after {
      top: unset !important;
    }
  }
}

.mb-vdp {
  margin-bottom: 22px;
}

.icon-hover {
  opacity: .75;
  &:hover {
    opacity: 1;
  }
}
</style>
