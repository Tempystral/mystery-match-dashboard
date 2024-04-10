import { useDate } from "vuetify/lib/framework.mjs";
import { IUtils } from "@date-io/core/IUtils";
import { computed, ref } from "vue";
import { setTime } from "@client/util/utils";

export function useDateTime<TAdapter extends IUtils<any, any>>() {
  const dateUtil = useDate() as TAdapter;
  const dateModel = ref<Date>(new Date());
  const timeModel = ref({ hours: 0, minutes: 0, seconds: 0 });
  const editedDateTime = computed(() => setTime(timeModel.value, dateUtil.date(dateModel.value)));

  return { dateUtil, dateModel, timeModel, editedDateTime };
}
