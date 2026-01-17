export const formatMoneySGD = (n: number): string => {
  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(n);
  return `${sign}S$${abs.toFixed(2)}`;
};

export const addMonths = (date: Date, delta: number): Date => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + delta);
  return d;
};

export const monthTitle = (date: Date): string => {
  const m = date.toLocaleString("en-US", { month: "long" });
  const y = date.getFullYear();
  return `${m}, ${y}`;
};
