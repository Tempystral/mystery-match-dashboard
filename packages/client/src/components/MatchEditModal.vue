<script setup lang="ts">
  import { diff } from "deep-object-diff";
  import { clone, isEmpty } from "lodash-es";
  import { ref, toRaw, watch, computed } from 'vue';
  import { MatchResponse, MatchUpdateRequest, defaultMatchResponse, RoundLabel, PlayerResponse, ScoreResponse, defaultScoreResponse } from "@mmd/common"
  import DateFnsAdapter from "@date-io/date-fns";
  import VueDatePicker from "@vuepic/vue-datepicker";
  import '@vuepic/vue-datepicker/dist/main.css';
  import { extractTime } from "@client/util/utils";
  import { useDateTime } from "@client/composables/dateTime";

  const props = defineProps<{
    match: MatchResponse,
    playerData?: PlayerResponse[],
    isLoading: boolean,
    playerError: Error | null
  }>();

  const emit = defineEmits<{
    updateMatch: [value: MatchUpdateRequest];
  }>();

  const showDialog = defineModel<boolean>({});
  const closeDialog = () => showDialog.value = false;

  /* Match values */
  const editedMatch = ref<MatchResponse>(defaultMatchResponse);
  const { dateModel, timeModel, editedDateTime } = useDateTime<DateFnsAdapter>();

  const rounds = Object.entries(RoundLabel).map(e => {return {title: e[1], value: e[0]}});

  /* Player values */
  const playerPanelOpen = ref("");
  /** Stores the list of active players in a match */
  const playerSlots = ref([] as PlayerResponse[]);
  /** Pads the model to 4 slots */
  const selectedPlayers = ref<{player: PlayerResponse, score: ScoreResponse}[]>([]);
  const maxAllowedPlayers = computed(() => editedMatch.value.round.match(/GROUP|TIE|UNKNOWN/) ? 4 : 2);

  watch(playerSlots, newPlayers => {
    while (playerSlots.value.length > maxAllowedPlayers.value) {
      playerSlots.value.pop(); // Reduce allowed amount to 4
    }
    selectedPlayers.value = newPlayers.map(p => (
      {
        player: p,
        score: { ... (p.Score ?? defaultScoreResponse) }
      })
    )
  })

  // Initialize and clean up values on hide/show
  watch(showDialog, (isShowing) => {
    isShowing ? setDefaults() : clear();
  })

  function setDefaults() {
      // Setup split time values
      editedMatch.value = clone(props.match);
      dateModel.value = editedMatch.value.date;
      timeModel.value = extractTime(editedMatch.value.date);

      // Reset player edit section
      playerSlots.value = [];
      selectedPlayers.value = [];

      // Fill out existing players, if any
      playerSlots.value = [... editedMatch.value.players ?? []];
      playerPanelOpen.value = playerSlots.value.length ? `players` : ``
  }

  function clear() {
    editedMatch.value = defaultMatchResponse;
    dateModel.value = new Date();
    timeModel.value = {hours: 0, minutes: 0, seconds: 0};

    // Reset player edit section
    playerSlots.value = [];
    selectedPlayers.value = [];
  }

  function toChangedValues(...players: PlayerResponse[]) {
    return players.map(p => (
      { player_id: p.player_id,
        points: p.Score?.points,
        outcome: p.Score?.outcome
      })
    );
  }

  // Determine what, if any properties have changed and emit a request to update data.
  const submit = () => {
    editedMatch.value.date = editedDateTime.value;

    const finalPlayers = new Map<string, PlayerResponse>(selectedPlayers.value.map(p => [p.player.player_id, {...toRaw(p.player), Score: toRaw(p.score)}] ));

    const removedPlayers: string[] = [];
    const addedPlayers: NonNullable<MatchUpdateRequest["players"]>["set"] = [];
    // Find players in the original list NOT in the final one
    toRaw(editedMatch.value.players)?.forEach(player => {
      const fp = finalPlayers.get(player.player_id);
      if (fp) {
        // If an element is present in both lists
        if (!isEmpty(diff(player, fp))) { // And it's modified
          console.log(`Adding to addedPlayers: ${player.player_id}`)
          addedPlayers.push(...toChangedValues(fp)); // Add it to the added list
        } // In either case, remove from finalPlayers since it's been counted
        finalPlayers.delete(player.player_id);
      } else { // If it's not in the final list, remove it
        console.log(`Adding to removedPlayers: ${player.player_id}`)
        removedPlayers.push(player.player_id);
      }
    });
    // The remaining keys in finalPlayers are values we haven't counted
    // They belong to the final list but not the original
    const changed = toChangedValues(...Array.from(finalPlayers.values()));
    console.log(`Adding remaining to addedPlayers: ${changed.map(val => val.player_id).join(", ")}`)
    addedPlayers.push(...changed);

    const changedValues = diff(props.match, editedMatch.value) as Partial<MatchResponse>;
    // Dumb hack to remove date comparisons failing
    if (Object.hasOwn(changedValues, "date")) {
      if (changedValues.date == editedMatch.value.date) {
        delete changedValues.date;
      }
    }

    const request: MatchUpdateRequest = {
      match_id: props.match.match_id,
      match: changedValues,
      ...( // Only set players if one of the lists has values
        (addedPlayers.length || removedPlayers.length) &&
        {
          players:  {
            set: addedPlayers,
            remove: removedPlayers
          }
        }
      )
    }

    if (!isEmpty(request.match) || request.players ) {
      console.log(request);
      //emit("updateMatch", {match_id: props.match.match_id, match: changedValues});
    }
    closeDialog();
  }
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
                    v-model="playerSlots"
                    :items="playerData ?? []"
                    item-title="twitch_name"
                    :item_props="true"
                    return-object
                    multiple
                    chips>
                  </v-combobox>
                </v-col>
              </v-row>
              <v-divider v-if="playerSlots" class="mx-12 mb-6" />
              <v-row>
                <v-col
                  cols="6"
                  v-for="{player, score}, index in selectedPlayers"
                  :key="player.player_id"
                  :id="`player-${player.player_id}`">
                  <v-card
                    v-if="player"
                    variant="elevated"
                    color="light-blue-darken-4"
                    elevation="8"
                    class="pa-2">
                    <v-row>
                      <v-col cols="8" align-self="center">
                        <v-label class="mx-2 font-weight-bold">
                          {{ player?.twitch_name }}
                        </v-label>
                        <v-chip
                          v-if="player?.pronouns"
                          :text="player?.pronouns"
                          size="small"
                          variant="flat"
                          color="white" />
                      </v-col>
                      <v-col>
                        <!-- This field should change if the match type / outcome is not a score type -->
                        <v-text-field v-model="score.points" hide-details variant="outlined" label="Score">
                          <template #append-inner>
                            <div class="d-flex flex-column justify-center">
                              <v-icon
                                icon="fas fa-chevron-up"
                                size="tiny"
                                role="button"
                                aria-label="Increase Score"
                                class="icon-hover"
                                @click="score.points++" />
                              <v-icon
                                icon="fas fa-chevron-down"
                                size="tiny"
                                role="button"
                                aria-label="Decrease Score"
                                class="icon-hover"
                                @click="score.points--" />
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
        <v-btn variant="tonal" color="success" text="Save" @click="submit" />
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
