export const fmtUSD = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function formatUSD(n?: number): string {
  if (n == null || Number.isNaN(n)) return "";
  return fmtUSD.format(n);
}

export function parseCurrencyInput(input: string): number | undefined {
  const digits = input.replace(/[^\d]/g, "");
  return digits ? Number(digits) : undefined;
}
