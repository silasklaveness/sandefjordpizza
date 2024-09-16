export function dbTimeForHuman(isoString) {
  const date = new Date(isoString);
  return date
    .toLocaleString("no-NO", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
    .replace(",", ""); // Optional: remove the comma between date and time
}
