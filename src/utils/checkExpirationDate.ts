import dayjs from "dayjs";

export function checkExpirationDate(expirationDate: string) {
  const today = dayjs().format("MM/YY");

  const dateExpirationDate = dayjs(expirationDate);
  const dateToday = dayjs(today);
  const diff = dateExpirationDate.diff(dateToday);

  return diff;
}
