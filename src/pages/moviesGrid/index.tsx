import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";

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
} from "@/components/FormMoviesData";

import {
  PAGE_SIZE,
  filterMovies,
  paginate,
  getPageCount,
  buildPageNumbers,
  makeMovieFromForm,
} from "./utils";
import { getMovies } from "@/service/moviesApi";
import type { MovieData } from "@/service/movies";

export default function MoviesPage() {
  const [all, setAll] = useState<MovieData[] | null>(null);
  const [openNew, setOpenNew] = useState(false);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    getMovies({}).then((list) => setAll(list as MovieData[]));
  }, []);

  const filtered = useMemo(() => filterMovies(all, query), [all, query]);
  const pageCount = useMemo(
    () => getPageCount(filtered?.length ?? 0, PAGE_SIZE),
    [filtered]
  );
  const items = useMemo(
    () => paginate<MovieData>(filtered, page, PAGE_SIZE),
    [filtered, page]
  );
  const numbers = useMemo(
    () => buildPageNumbers(page, pageCount),
    [page, pageCount]
  );

  function handleCreateMovie(values: FormMoviesValues) {
    const newMovie = makeMovieFromForm(values);
    setAll((prev) => [newMovie, ...(prev ?? [])]);
    setOpenNew(false);
    setPage(1);
  }

  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 py-4 space-y-6">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Input
            value={query}
            onChange={(e) => {
              setPage(1);
              setQuery(e.target.value);
            }}
            placeholder="Pesquise por filmes"
            className="h-11 pl-11 bg-bg-elev text-fg"
          />
          <Search className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-mauve-10" />
        </div>
        <AppButton variant="subtle">Filtros</AppButton>
        <AppButton onClick={() => setOpenNew(true)}>Adicionar Filme</AppButton>
      </div>

      {!all ? (
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
              genres={m.genres}
              year={m.year}
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
                setPage((p) => Math.max(1, p - 1));
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
                setPage((p) => Math.min(pageCount, p + 1));
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <FormMoviesData
        open={openNew}
        onOpenChange={setOpenNew}
        onSubmit={handleCreateMovie}
      />
    </div>
  );
}
