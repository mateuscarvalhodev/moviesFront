export type StatusEnumType =
  | "RELEASED"
  | "ANNOUNCED"
  | "CANCELED"
  | "IN_PRODUCTION";

export type ContentRatingEnumType =
  | "ALL_AGES"
  | "AGE_10"
  | "AGE_12"
  | "AGE_14"
  | "AGE_16"
  | "AGE_18";

export type MovieDetailsData = {
  originalTitle: string;
  tagline?: string;
  overview?: string;
  releaseDate?: string;
  runtimeMinutes?: number;
  title: string;
  status?: StatusEnumType;
  originalLanguage?: string;
  budget?: number;
  revenue?: number;
  backdropUrl?: string;
  trailerUrl?: string;
  rating?: string;
  posterUrl?: string;
  genres: string[];
  profit?: number;
  contentRating?: ContentRatingEnumType;
  studioId: string;
  subtitle?: string;
  releaseYear?: number;
  approbation?: number;
  rawGenres: { id: string; name: string }[];
};
