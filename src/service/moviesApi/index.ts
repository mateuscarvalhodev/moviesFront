import type { FormMoviesValues } from "@/components/FormMoviesData";
import api from "..";
import type { CreateMoviePayload, MovieDTO } from "./types";

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
    runtimeMinutes: values.runtimeMinutes ?? undefined,
    releaseYear: values.year,
    contentRating: values.contentRating,
    status: values.status,
    budget: values.budget ?? undefined,
    revenue: values.revenue ?? undefined,
    profit: values.profit ?? undefined,
    studioId: values.studioId,
    trailerYouTubeId: values.trailerYouTubeId || undefined,
    genres: splitGenres(values.genres),
  };
}

function appendIfDefined(fd: FormData, key: string, v: unknown) {
  if (v === undefined || v === null) return;
  fd.append(key, typeof v === "number" ? String(v) : (v as string));
}

function buildMovieFormData(
  payload: CreateMoviePayload,
  poster?: File
): FormData {
  const fd = new FormData();

  // obrigatórios
  fd.append("title", payload.title);
  fd.append("originalTitle", payload.originalTitle);
  fd.append("releaseYear", String(payload.releaseYear));
  fd.append("contentRating", payload.contentRating);
  fd.append("status", payload.status);
  fd.append("studioId", payload.studioId);

  // Opcionais
  appendIfDefined(fd, "subtitle", payload.subtitle);
  appendIfDefined(fd, "overview", payload.overview);
  appendIfDefined(fd, "runtimeMinutes", payload.runtimeMinutes);
  appendIfDefined(fd, "budget", payload.budget);
  appendIfDefined(fd, "revenue", payload.revenue);
  appendIfDefined(fd, "profit", payload.profit);
  appendIfDefined(fd, "trailerYouTubeId", payload.trailerYouTubeId);

  if (payload.genres && payload.genres.length) {
    for (const g of payload.genres) {
      fd.append("genres", g);
    }
  }

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
  const { data } = await api.get("/movies", { params });
  return data.items;
}

export async function getMovieId(id: string): Promise<MovieDTO> {
  const { data } = await api.get(`/movies/${id}`);
  return data;
}
