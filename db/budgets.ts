export function toMonthKey(year: number, month1to12: number): number {
  // 2026 + 01 -> 202601
  return year * 100 + month1to12;
}

export function fromMonthKey(monthKey: number): {
  year: number;
  month1to12: number;
} {
  const year = Math.floor(monthKey / 100);
  const month1to12 = monthKey % 100;
  return { year, month1to12 };
}

// If you have a Date:
export function monthKeyFromDate(d: Date): number {
  return toMonthKey(d.getFullYear(), d.getMonth() + 1);
}
