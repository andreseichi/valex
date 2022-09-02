export function getCardholderName(fullName: string) {
  const fullNameFiltered = fullName
    .split(" ")
    .filter((name) => name.length >= 3);
  const firstName = fullNameFiltered[0];
  const lastName = fullNameFiltered[fullNameFiltered.length - 1];
  const cardholderName = `${firstName} ${fullNameFiltered
    .slice(1, fullNameFiltered.length - 1)
    .map((name) => name[0])
    .join(" ")} ${lastName}`.toUpperCase();

  return cardholderName;
}
