export function toHumanReadableDate(date: string): string {
  const dateObj = new Date(date);
  return dateObj.toLocaleString();
}
