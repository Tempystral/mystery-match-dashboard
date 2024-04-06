<script setup lang="ts">
  import { diff } from "deep-object-diff";
  import { clone, isEmpty } from "lodash-es";
  import { computed, ref } from 'vue';
  import { MatchResponse, MatchUpdateRequest, defaultMatchResponse, RoundLabel, Round } from "@mmd/common"
  import { watch } from "vue";
  import { VTimePicker } from "vuetify/lib/labs/components.mjs";
  import { useDate } from "vuetify/lib/framework.mjs";
  import DateFnsAdapter from "@date-io/date-fns";
  import VueDatePicker from "@vuepic/vue-datepicker";
  import '@vuepic/vue-datepicker/dist/main.css';

  const props = defineProps<{
    match: MatchResponse
  }>();

  const emit = defineEmits<{
    updatePlayer: [value: MatchUpdateRequest];
  }>();

  const showDialog = defineModel<boolean>({});

  const editedMatch = ref<MatchResponse>(defaultMatchResponse);

  const dateUtil = useDate() as DateFnsAdapter;
  const editedDate = ref(dateUtil.date())
  const editedTime = ref(dateUtil.date());

  const fullEditedDate = computed(() => {
    const newDate = dateUtil.date(editedDate.value);
    newDate?.setTime(editedTime.value.getTime())
    return newDate;
  });

  watch(showDialog, (isShowing) => {
    if (isShowing) {
      editedMatch.value = clone(props.match);
      editedDate.value = dateUtil.date(editedMatch.value.date);
    }
  })

  // Determine what, if any properties have changed and emit a request to update data.
  const submit = () => {
    const changedValues = diff(props.match, editedMatch.value);
    if (!isEmpty(changedValues)) {
      console.log(changedValues);
      emit("updatePlayer", {match_id: props.match.match_id, match: changedValues});
    }
    closeDialog();
  }

  const closeDialog = () => showDialog.value = false;

  const rounds = Object.entries(RoundLabel).map(e => {return {title: e[1], value: e[0]}});
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
            <div id="right-side">
              <v-row>
                <v-col cols="12">
                  <VueDatePicker
                    v-model="editedDate"
                    :is24="false"
                    :clearable="false"
                    text-input
                    dark
                    partial-flow
                    :enable-time-picker="false"
                    menu-class-name="elevation-18"
                    class="mb-vdp">
                    <template #dp-input="{ value }">
                      <v-text-field
                        label="Date"
                        required
                        hide-details
                        :model-value="value"
                        density="compact"
                        variant="outlined"
                        prepend-icon="fas fa-calendar-days" />
                    </template>
                  </VueDatePicker>
                  <VueDatePicker
                    v-model="editedTime"
                    :is24="false"
                    :clearable="false"
                    text-input
                    dark
                    partial-flow
                    time-picker
                    menu-class-name="elevation-18"
                    class="mb-vdp">
                    <template #dp-input="{ value }">
                      <v-text-field
                        label="Time"
                        required
                        hide-details
                        :model-value="value"
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
            </div>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider class="mx-4 mb-2" />

      <v-card-title>Players</v-card-title>
      <div class="px-4">
        <v-row>
          <v-col cols="6" v-for="player of editedMatch.players" :key="player?.player_id">
            <v-card color="black" class="ma-2">{{ player?.twitch_name }}</v-card>
          </v-col>
        </v-row>
      </div>
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
</style>
