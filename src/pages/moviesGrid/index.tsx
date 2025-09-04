import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Link } from "react-router";
import { fetchMockMovies, type MovieMock } from "@/service/movies";
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

const PAGE_SIZE = 10;

export default function MoviesPage() {
  const [all, setAll] = useState<MovieMock[] | null>(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchMockMovies().then(setAll);
  }, []);

  const filtered: MovieMock[] | null = useMemo(() => {
    if (!all) return null;
    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.genres?.some((g) => g.toLowerCase().includes(q)) ||
        String(m.year).includes(q)
    );
  }, [all, query]);

  const pageCount: number = filtered
    ? Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
    : 1;

  const items: MovieMock[] =
    filtered?.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE) ?? [];

  const numbers: number[] = useMemo(() => {
    const out: number[] = [];
    const max = pageCount;
    const push = (n: number) =>
      n >= 1 && n <= max && !out.includes(n) && out.push(n);
    push(1);
    push(page - 1);
    push(page);
    push(page + 1);
    push(max);
    return out.sort((a, b) => a - b);
  }, [page, pageCount]);

  const skeletonCount = PAGE_SIZE;

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
        <AppButton variant="secondary">Filtros</AppButton>
        <AppButton asChild>
          <Link to="/movies/new">Adicionar Filme</Link>
        </AppButton>
      </div>

      {!all ? (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: skeletonCount }).map((_, i) => (
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
    </div>
  );
}
