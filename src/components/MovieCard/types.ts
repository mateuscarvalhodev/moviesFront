import type { ReactNode } from "react";

type RatingScale = "percent" | "ten";

export type MovieCardProps = {
  title: string;
  posterUrl: string;
  genres?: string[];
  releaseYear?: number | string;
  rating?: number;
  ratingScale?: RatingScale;
  to?: string;
  className?: string;
  action?: ReactNode;
};
