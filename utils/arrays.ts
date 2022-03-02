export function sortByDate<T>(
  arr: T[],
  dateSelector: (item: T) => string,
  ascending = false,
): T[] {
  return arr.sort(
    (a, b) => ((
      !ascending
        ? new Date(dateSelector(b)) > new Date(dateSelector(a))
        : new Date(dateSelector(a)) > new Date(dateSelector(b))
    ) ? 1 : -1),
  );
}
