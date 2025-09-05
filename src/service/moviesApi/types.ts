export interface MovieDTO {
  id: string;
  title: string;
  originalTitle: string;
  originalLanguage: string;
  subtitle?: string;
  overview?: string;
  runtimeMinutes?: number;
  releaseYear: number;
  releaseDate?: string | null;
  contentRating: ContentRating;
  status: Status;
  budget?: number | null;
  revenue?: number | null;
  profit?: number | null;
  studio?: { id: string; name: string } | null;
  posterUrl?: string | null;
  backdropUrl?: string | null;
  trailerUrl?: string | null;
  genres?: Array<{ id?: number | string; name: string }>;
  createdAt?: string;
  updatedAt?: string;
}
export type ContentRating =
  | "ALL_AGES"
  | "AGE_10"
  | "AGE_12"
  | "AGE_14"
  | "AGE_16"
  | "AGE_18";

export type Status = "RELEASED" | "ANNOUNCED" | "CANCELED" | "IN_PRODUCTION";

export interface CreateMoviePayload {
  approbation?: number;
  title: string;
  originalTitle: string;
  subtitle?: string;
  overview?: string;
  runtimeMinutes?: number;
  releaseYear: number;
  contentRating: ContentRating;
  status: Status;
  budget?: number;
  revenue?: number;
  profit?: number;
  studioId: string;
  trailerUrl?: string;
  genres?: string[];
}

export interface StudioDTO {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface GenresDTO {
  id: string;
  name: string;
}
