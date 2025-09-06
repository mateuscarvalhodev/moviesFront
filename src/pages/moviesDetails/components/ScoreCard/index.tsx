import {
  normalizeRatingPercent,
  getCircleProgress,
} from "@/pages/moviesDetails/utils";

export const ScoreCard = ({
  percent,
}: {
  percent: number | null | undefined;
}) => {
  const p = normalizeRatingPercent(percent) ?? 0;
  const { dashArray } = getCircleProgress(18, p);

  return (
    <div
      className="relative grid place-items-center"
      style={{ width: 56, height: 56 }}
    >
      <svg width="56" height="56" viewBox="0 0 44 44">
        <circle
          cx="22"
          cy="22"
          r={18}
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="4"
          fill="none"
        />
        <circle
          cx="22"
          cy="22"
          r={18}
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={dashArray}
          className="text-yellow-400"
          fill="none"
        />
      </svg>
      <span className="absolute text-xs font-semibold text-white">{p}%</span>
    </div>
  );
};
