import type { MovieMock } from "@/service/movies";

export type MovieDetailsData = MovieMock & {
  originalTitle: string;
  tagline?: string;
  overview?: string;
  releaseDate?: string;
  runtimeMinutes?: number;
  status?: string;
  originalLanguage?: string;
  budget?: number;
  revenue?: number;
  backdropUrl?: string;
  trailerYouTubeId?: string;
};
