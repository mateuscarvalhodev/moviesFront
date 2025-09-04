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

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function normalizeRatingPercent(rating?: number | null): number | null {
  if (rating == null || Number.isNaN(rating)) return null;
  return clamp(Math.round(rating), 0, 100);
}

export function getCircleProgress(radius: number, percent: number) {
  const circumference = 2 * Math.PI * radius;
  const filled = (percent / 100) * circumference;
  const dashArray = `${filled} ${circumference - filled}`;
  return { circumference, dashArray, filled };
}
