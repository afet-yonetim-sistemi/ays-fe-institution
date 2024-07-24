import { DateTime } from "luxon";

export const formatDate = (date: string) => {
  return DateTime
    .fromISO(date, { zone: "UTC" })
    .setZone(DateTime.local().zoneName)
    .toFormat("dd.MM.yyyy HH:mm");
};
