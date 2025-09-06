import type { FormMoviesValues } from "@/components/FormMoviesData";
import api from "..";
import type {
  CreateMoviePayload,
  GenresDTO,
  MovieDTO,
  StudioDTO,
} from "./types";

function buildMoviePayload(values: FormMoviesValues): CreateMoviePayload {
  return {
    title: values.title,
    originalTitle: values.originalTitle,
    subtitle: values.subtitle || undefined,
    overview: values.overview || undefined,
    runtimeMinutes: values.runtimeMinutes ?? undefined,
    releaseYear: values.releaseYear,
    contentRating: values.contentRating,
    status: values.status,
    budget: values.budget ?? undefined,
    revenue: values.revenue ?? undefined,
    profit: values.profit ?? undefined,
    studioId: values.studioId,
    trailerUrl: values.trailerUrl || undefined,
    genres: values.genres && values.genres.length ? values.genres : undefined,
    approbation: values.approbation || undefined,
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
  appendIfDefined(fd, "trailerUrl", payload.trailerUrl);
  appendIfDefined(fd, "approbation", payload.approbation);

  if (payload.genres && payload.genres.length) {
    for (const g of payload.genres) {
      fd.append("genres[]", g);
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

export async function editMovie(
  id: string,
  values: FormMoviesValues
): Promise<MovieDTO> {
  const payload = buildMoviePayload(values);

  if (values.posterFile) {
    const form = buildMovieFormData(payload, values.posterFile);
    const { data } = await api.put<MovieDTO>(`/movies/${id}`, form);
    return data;
  }

  const { data } = await api.put<MovieDTO>(`/movies/${id}`, payload, {
    headers: { "Content-Type": "application/json" },
  });
  return data;
}

export async function deleteMovie(id: string): Promise<void> {
  await api.delete(`/movies/${id}`);
}

export async function getMovies(params: Record<string, string>) {
  const { data } = await api.get("/movies", { params });
  return data.items;
}

export async function getMovieId(id: string): Promise<MovieDTO> {
  const { data } = await api.get(`/movies/${id}`);
  return data;
}

export async function getMoviesStudios(): Promise<StudioDTO[]> {
  const { data } = await api.get<StudioDTO[]>("/studios");
  return data;
}

export async function getMoviesGenres(): Promise<GenresDTO[]> {
  const { data } = await api.get("/genres");
  return data.items;
}
