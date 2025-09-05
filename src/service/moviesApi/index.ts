import type { FormMoviesValues } from "@/components/FormMoviesData";
import api from "..";

export type Status = "RELEASED" | "ANNOUNCED" | "CANCELED" | "IN_PRODUCTION";
export type ContentRating = "ALL_AGES" | "PG" | "PG_13" | "R" | "NC_17";

export interface CreateMoviePayload {
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
  trailerYouTubeId?: string;
  genres?: string[];
}

export interface MovieDTO {
  id: string;
  title: string;
  originalTitle: string;
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

function splitGenres(input?: string): string[] | undefined {
  const arr =
    input
      ?.split(",")
      .map((s) => s.trim())
      .filter(Boolean) ?? [];
  return arr.length ? arr : undefined;
}

function buildMoviePayload(values: FormMoviesValues): CreateMoviePayload {
  return {
    title: values.title,
    originalTitle: values.originalTitle,
    subtitle: values.subtitle || undefined,
    overview: values.overview || undefined,
    runtimeMinutes: values.runtimeMinutes || undefined,
    releaseYear: values.year,
    contentRating: values.contentRating,
    status: values.status,
    budget: values.budget ?? undefined,
    revenue: values.revenue ?? undefined,
    profit: values.profit ?? undefined,
    studioId: values.studioName,
    trailerYouTubeId: values.trailerYouTubeId || undefined,
    genres: splitGenres(values.genres),
  };
}

function buildMovieFormData(
  payload: CreateMoviePayload,
  poster?: File
): FormData {
  const fd = new FormData();
  fd.append("data", JSON.stringify(payload));
  if (poster) {
    fd.append("poster", poster, poster.name);
  }
  return fd;
}

export async function createMovie(values: FormMoviesValues): Promise<MovieDTO> {
  const payload = buildMoviePayload(values);

  if (values.posterFile) {
    const form = buildMovieFormData(payload, values.posterFile);
    const { data } = await api.post<MovieDTO>("/movies/create", form);
    return data;
  }

  const { data } = await api.post<MovieDTO>("/movies/create", payload, {
    headers: { "Content-Type": "application/json" },
  });
  return data;
}
export async function getMovies(params: Record<string, string>) {
  const { data } = await api.get("/movies", {
    params,
  });
  console.log({ data });
  return data.items;
}
export async function getMovieId(id: string): Promise<MovieDTO> {
  const { data } = await api.get(`/movies/${id}`);

  return data;
}
