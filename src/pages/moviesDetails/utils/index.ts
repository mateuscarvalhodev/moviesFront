export const formatRuntime = (min?: number): string => {
  if (!min || min <= 0) return "-";
  const h = Math.floor(min / 60);
  const r = min % 60;
  return `${h}h ${r}m`;
};

export const moneyUSD = (n?: number): string => {
  if (typeof n !== "number") return "-";
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
};
