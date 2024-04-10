import DateFnsAdapter from "@date-io/date-fns";

export function capitalize(sentence?: String) {
  return sentence
    ?.split(" ")
    .map((word) => word.slice(0, 1).toUpperCase() + word.slice(1))
    .join(" ");
}

type BasicTime = {
  hours: number;
  minutes: number;
  seconds: number;
};

/**
 * Extract the hours, minutes, and seconds from a date object.
 * Defaults to midnight if the date is invalid.
 */
export function extractTime(date: Date) {
  const wrapper = new DateFnsAdapter().date(date);
  return {
    hours: wrapper?.getHours() ?? 0,
    minutes: wrapper?.getMinutes() ?? 0,
    seconds: wrapper?.getSeconds() ?? 0,
  };
}

/**
 * Set the hours, minutes, and seconds on a date object
 * @param time
 * @param date
 */
export function setTime(time: BasicTime, date: Date) {
  const { hours, minutes, seconds } = time;
  date.setHours(hours);
  date.setMinutes(minutes);
  date.setSeconds(seconds);
  return date;
}
