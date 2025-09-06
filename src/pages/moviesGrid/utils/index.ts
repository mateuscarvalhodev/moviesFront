import type { FormMoviesValues } from "@/components/FormMoviesData";
import type { MovieData } from "@/service/movies";

export const PAGE_SIZE = 10;

export function paginate<T>(
  arr: T[] | null,
  page: number,
  pageSize: number
): T[] {
  if (!arr) return [];
  const start = (page - 1) * pageSize;
  return arr.slice(start, start + pageSize);
}

export function getPageCount(totalItems: number, pageSize: number): number {
  return Math.max(1, Math.ceil(totalItems / pageSize));
}

export function buildPageNumbers(page: number, pageCount: number): number[] {
  const out: number[] = [];
  const push = (n: number) => {
    if (n >= 1 && n <= pageCount && !out.includes(n)) out.push(n);
  };
  push(1);
  push(page - 1);
  push(page);
  push(page + 1);
  push(pageCount);
  return out.sort((a, b) => a - b);
}

export function generateId(): string {
  try {
    const rnd = (globalThis.crypto as Crypto | undefined)?.randomUUID?.();
    return rnd ?? String(Date.now());
  } catch {
    return String(Date.now());
  }
}

export function parseGenres(input?: string[]): string[] {
  return input?.map((s) => s.trim()).filter(Boolean) ?? [];
}

function fileToObjectUrl(file?: File): string | undefined {
  if (!file) return undefined;
  try {
    return URL.createObjectURL(file);
  } catch {
    return undefined;
  }
}

const PLACEHOLDER_POSTER = "https://via.placeholder.co/400x600?text=Poster";

export function makeMovieFromForm(values: FormMoviesValues): MovieData {
  const posterUrl = fileToObjectUrl(values.posterFile) ?? PLACEHOLDER_POSTER;

  return {
    id: generateId(),
    title: values.title,
    releaseYear: values.releaseYear,
    posterUrl,
    genres: parseGenres(values.genres),
    rating: 70,
  };
}
