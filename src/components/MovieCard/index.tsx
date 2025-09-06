import { Link } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { MovieCardProps } from "./types";
import { useMemo } from "react";

export const MovieCard = ({
  title,
  posterUrl,
  genres = [],
  releaseYear,
  rating,
  ratingScale = "percent",
  to,
  className,
  action,
}: MovieCardProps) => {
  const pct = useMemo(() => {
    if (rating == null || Number.isNaN(rating)) return null;
    const v = ratingScale === "ten" ? rating * 10 : rating;
    return Math.max(0, Math.min(100, Math.round(v)));
  }, [rating, ratingScale]);

  const r = 18;
  const c = 2 * Math.PI * r;
  const dash = pct != null ? (pct / 100) * c : 0;

  const CardInner = (
    <Card
      className={cn(
        "group relative overflow-hidden rounded-xl border border-white/10",
        "bg-mauve-3/50 shadow-lg transition-transform",
        "hover:scale-[1.02] hover:shadow-2xl",
        className
      )}
    >
      <CardContent className="p-0">
        <div className="aspect-[2/3] w-full bg-mauve-4">
          <img
            src={posterUrl}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              e.currentTarget.src =
                "data:image/svg+xml;charset=UTF-8," +
                encodeURIComponent(
                  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 600'>
                     <rect width='100%' height='100%' fill='#1f1b24'/>
                     <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
                           fill='#8e8c99' font-family='system-ui' font-size='20'>
                       sem imagem
                     </text>
                   </svg>`
                );
            }}
          />
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {action ? (
          <div className="absolute right-2 top-2 z-10">{action}</div>
        ) : null}

        {pct != null && (
          <div className="absolute left-3 top-3 grid place-items-center rounded-full bg-black/55 backdrop-blur-sm p-1">
            <svg
              width="44"
              height="44"
              viewBox="0 0 44 44"
              className="drop-shadow-sm"
            >
              <circle
                cx="22"
                cy="22"
                r={r}
                stroke="rgba(255,255,255,0.18)"
                strokeWidth="4"
                fill="none"
              />
              <circle
                cx="22"
                cy="22"
                r={r}
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${dash} ${c - dash}`}
                className="text-yellow-400"
                fill="none"
              />
            </svg>
            <span className="absolute text-[11px] font-semibold text-white">
              {pct}%
            </span>
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 p-3">
          <div className="h-20 flex flex-col justify-end">
            <h3
              className="
                line-clamp-2 font-semibold text-white tracking-wide
                transition-transform duration-300
                group-hover:-translate-y-5
              "
            >
              {title}
            </h3>

            <p
              className="
                text-sm text-mauve-10
                opacity-0 max-h-0 overflow-hidden translate-y-2
                transition-all duration-300
                group-hover:opacity-100 group-hover:max-h-12 group-hover:translate-y-0
              "
            >
              {[genres.join(", "), releaseYear].filter(Boolean).join(" • ")}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return to ? (
    <Link to={to} className="block" aria-label={title}>
      {CardInner}
    </Link>
  ) : (
    <div className="block">{CardInner}</div>
  );
};
