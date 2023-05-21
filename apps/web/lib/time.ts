export function duration(ms: number, short?: boolean): string {
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  if (days) {
    return days >= 2 ? `${days} ${short ? "d" : "days"}` : `${days} ${short ? "d" : "day"}`;
  }
  const hours = Math.floor(ms / (1000 * 60 * 60));
  if (hours) {
    return hours >= 2 ? `${hours} ${short ? "h" : "hours"}` : `${hours} ${short ? "h" : "hour"}`;
  }
  const minutes = Math.floor(ms / (1000 * 60));
  if (minutes) {
    return minutes >= 2
      ? `${minutes} ${short ? "m" : "minutes"}`
      : `${minutes} ${short ? "m" : "minute"}`;
  }
  const seconds = Math.floor(ms / (1000 * 60));
  if (seconds >= 10) {
    return `${seconds} ${short ? "s" : "seconds"}`;
  }

  return "a few seconds";
}
