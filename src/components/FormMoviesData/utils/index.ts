export const fmtUSD = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function formatUSD(n: string = ""): string {
  const value = n.replace(/\D/g, "");
  if (value == null || Number.isNaN(value)) return "";
  return fmtUSD.format(Number(value));
}

export function strCurrencyToNumber(input?: string): number | undefined {
  if (!input) return undefined;
  const value = input.replace(/\D/g, "");
  if (value == null || Number.isNaN(value)) return undefined;
  return Number(value);
}
