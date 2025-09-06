/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState, useCallback } from "react";
import { Search } from "lucide-react";
import { FiltersSheet } from "./components/FiltersSheet";
import { MovieCard } from "@/components/MovieCard";
import { Input } from "@/components/ui/input";
import { AppButton } from "@/components/Button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  FormMoviesData,
  type FormMoviesValues,
  type PayloadMovies,
} from "@/components/FormMoviesData";

import { PAGE_SIZE, getPageCount, buildPageNumbers } from "./utils";
import { getMovies, createMovie } from "@/service/moviesApi";
import type { MovieData } from "@/service/movies";
import { toast } from "sonner";
import { LoadingOverlay } from "@/components/Loading";
import { useDebounced } from "@/hooks/useDebounce";

const initialValues: FormMoviesValues = {
  title: "",
  originalTitle: "",
  subtitle: "",
  releaseYear: new Date().getFullYear(),
  runtimeMinutes: undefined,
  genres: [],
  posterFile: undefined,
  trailerUrl: "",
  overview: "",
  contentRating: "ALL_AGES",
  status: "RELEASED",
  budget: undefined,
  revenue: undefined,
  profit: undefined,
  studioId: "",
  approbation: 50,
};

export type MovieFilters = {
  q?: string;
  startYear?: number;
  endYear?: number;
  runtimeMin?: number;
  runtimeMax?: number;
  studioId?: string;
  genreId?: string;
};

type GenresArray = { id: string; name: string };

function pickGenreNames(
  genres: string[] | GenresArray[] | null | undefined
): string[] {
  if (!Array.isArray(genres)) return [];
  return genres
    .map((g) => (typeof g === "string" ? g : g?.name))
    .filter((n): n is string => Boolean(n));
}

export default function MoviesPage() {
  const [all, setAll] = useState<MovieData[]>([]);
  const [openNew, setOpenNew] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<MovieFilters>({ q: query });
  const [page, setPage] = useState(1);
  const [openFilters, setOpenFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const debouncedSearch = useDebounced(query, 500);

  const fetchList = useCallback(async () => {
    setLoading(true);
    const { items, total } = await getMovies({
      ...filters,
      page,
      pageSize: PAGE_SIZE,
    });
    setTotalItems(total);
    setAll(items as MovieData[]);
    setLoading(false);
  }, [page, filters]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  useEffect(() => {
    setFilters((prev) => ({ ...prev, q: debouncedSearch }));
    setPage(1);
  }, [debouncedSearch]);

  const pageCount = useMemo(
    () => getPageCount(totalItems ?? 0, PAGE_SIZE),
    [totalItems]
  );
  const items = useMemo(() => all, [all]);
  const numbers = useMemo(
    () => buildPageNumbers(page, pageCount),
    [page, pageCount]
  );

  async function handleCreateMovie(values: PayloadMovies) {
    try {
      await createMovie(values);
      await fetchList();
      toast.success("Filme criado com sucesso!");
      setFilters((prev) => ({ ...prev, page: 1 }));
      setOpenNew(false);
    } catch (e) {
      console.error("Falha ao atualizar a lista local após criação:", e);
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 py-4 space-y-6">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquise por filmes"
            className="h-11 pl-11 bg-bg-elev text-fg"
          />
          <Search className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-mauve-10" />
        </div>
        <AppButton variant="subtle" onClick={() => setOpenFilters(true)}>
          Filtros
        </AppButton>
        <AppButton onClick={() => setOpenNew(true)}>Adicionar Filme</AppButton>
      </div>
      {loading ? (
        <LoadingOverlay />
      ) : !all ? (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <div
              key={i}
              className="aspect-[2/3] rounded-xl bg-mauve-4/60 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {items.map((m) => (
            <MovieCard
              key={m.id}
              title={m.title}
              posterUrl={m.posterUrl}
              genres={pickGenreNames(m.genres as any)}
              releaseYear={m.releaseYear}
              rating={m.rating}
              to={`/movies/${m.id}`}
            />
          ))}
        </div>
      )}
      <Pagination className="mt-2">
        <PaginationContent className="justify-center">
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setPage(page - 1);
              }}
            />
          </PaginationItem>

          {numbers.map((n, idx) => {
            const prev = numbers[idx - 1];
            const showEllipsis = prev !== undefined && n - prev > 1;
            return (
              <span key={n} className="flex">
                {showEllipsis && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    isActive={n === page}
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(n);
                    }}
                  >
                    {n}
                  </PaginationLink>
                </PaginationItem>
              </span>
            );
          })}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setPage(page + 1);
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <FormMoviesData
        open={openNew}
        onOpenChange={setOpenNew}
        onSubmit={handleCreateMovie}
        defaultValues={initialValues}
      />
      <FiltersSheet
        open={openFilters}
        onOpenChange={setOpenFilters}
        onApply={fetchList}
        setFilters={setFilters}
      />
    </div>
  );
}
