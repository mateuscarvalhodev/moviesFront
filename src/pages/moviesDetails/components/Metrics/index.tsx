export const Metric = ({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) => (
  <div className="rounded-xl border border-white/10 bg-black/90 p-3">
    <div className="text-xs text-mauve-11">{label}</div>
    <div className="mt-1 text-xs font-semibold text-white">{value ?? "-"}</div>
  </div>
);
