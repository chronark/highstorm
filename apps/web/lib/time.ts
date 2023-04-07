export function duration(ms: number): string {
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  if (days) {
    return days >= 2 ? `${days} days` : `${days} day`;
  }
  const hours = Math.floor(ms / (1000 * 60 * 60));
  if (hours) {
    return hours >= 2 ? `${hours} hours` : `${hours} hour`;
  }
  const minutes = Math.floor(ms / (1000 * 60));
  if (minutes) {
    return minutes >= 2 ? `${minutes} minutes` : `${minutes} m`;
  }
  const seconds = Math.floor(ms / (1000 * 60));
  if (seconds >= 10) {
    return `${seconds} seconds`;
  }

  return "a few seconds";
}
