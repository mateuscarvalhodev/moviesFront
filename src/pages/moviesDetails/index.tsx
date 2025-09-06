import { useEffect, useMemo, useState, useCallback } from "react";
import { useParams } from "react-router";
import { AppButton } from "@/components/Button";
import { formatRuntime, moneyUSD, getCircleProgress } from "./utils";
import { Metric } from "./components/Metrics";

import type { MovieDetailsData } from "./types";
import type { MovieDTO } from "@/service/moviesApi/types";
import { getMovieId, deleteMovie, editMovie } from "@/service/moviesApi";

import {
  FormMoviesData,
  // type FormMoviesValues,
  type PayloadMovies,
} from "@/components/FormMoviesData";

import { strCurrencyToNumber } from "@/components/FormMoviesData/utils";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { getErrMsg } from "@/utils/getErrors";
import { ScoreCard } from "./components/ScoreCard";

function extractYouTubeId(input?: string | null): string | undefined {
  if (!input) return undefined;
  if (!input.includes("http")) {
    if (/^[a-zA-Z0-9_-]{6,}$/.test(input)) return input;
    return undefined;
  }
  try {
    const url = new URL(input);
    if (url.hostname.includes("youtu.be")) {
      return url.pathname.slice(1) || undefined;
    }
    const v = url.searchParams.get("v");
    if (v) return v;
    const parts = url.pathname.split("/");
    return parts.pop() || undefined;
  } catch {
    return undefined;
  }
}

function adaptDTO(dto: MovieDTO): MovieDetailsData {
  return {
    title: dto.title,
    subtitle: dto.subtitle ?? "",
    overview: dto.overview ?? "",
    posterUrl: dto.posterUrl ?? "",
    backdropUrl: dto.backdropUrl ?? undefined,
    genres: dto.genres?.map((g) => g.id) ?? [],
    rating: undefined,
    releaseDate:
      dto.releaseDate ??
      (dto.releaseYear ? String(dto.releaseYear) : undefined),
    runtimeMinutes: dto.runtimeMinutes ?? undefined,
    status: dto.status ?? undefined,
    originalLanguage: dto.originalLanguage ?? undefined,
    budget: dto.budget?.toString(),
    revenue: dto.revenue?.toString(),
    profit: dto.profit?.toString(),
    trailerUrl: extractYouTubeId(dto.trailerUrl),
    originalTitle: dto.originalTitle,
    studioId: dto.studioId,
    releaseYear: dto.releaseYear,
    contentRating: dto.contentRating,
    approbation: dto.approbation ?? 50,
    rawGenres: dto.genres ?? [],
  };
}

export const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<MovieDetailsData | null>(null);
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const getMovie = useCallback(() => {
    if (!id) return;
    getMovieId(id)
      .then((dto) => setData(adaptDTO(dto)))
      .catch(() => setData(null));
  }, [id]);

  useEffect(() => {
    getMovie();
  }, [getMovie]);

  const RADIUS = 18;
  const approbationPercent = data?.approbation ?? 0;
  useMemo(() => {
    const p = approbationPercent ?? 0;
    return getCircleProgress(RADIUS, p);
  }, [approbationPercent]);

  const releaseDisplay = useMemo(() => {
    const d = data?.releaseDate;
    if (!d) return "-";
    if (/^\d{4}-\d{2}-\d{2}/.test(d)) {
      const [y, m, day] = d.split("-");
      return `${day}/${m}/${y}`;
    }
    return d;
  }, [data?.releaseDate]);

  const handleConfirmDelete = async (): Promise<void> => {
    if (!id) return;
    try {
      setIsDeleting(true);
      await deleteMovie(id);
      toast.success("Filme deletado com sucesso.");
      setConfirmOpen(false);
      window.location.replace("/movies");
    } catch (err: unknown) {
      toast.error("Falha ao deletar filme", { description: getErrMsg(err) });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditMovie = async (value: PayloadMovies) => {
    if (!id) return;

    await editMovie(id, value);
    getMovie();
    toast.success("Filme editado com sucesso");
  };

  if (!data) {
    return (
      <div className="mx-auto w-full max-w-[1200px] px-4 py-8">
        <div className="h-[360px] rounded-xl bg-mauve-4/60 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute inset-0 h-[380px] -z-10">
        <img
          src={data.backdropUrl ?? data.posterUrl}
          alt={`${data.title} backdrop`}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/65" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[--bg]" />
      </div>

      <div className="mx-auto w-full max-w-[1200px] px-4 py-6 space-y-8">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-3xl font-bold text-white">{data.title}</h1>
          <div className="flex items-center gap-3">
            <AlertDialog
              open={confirmOpen}
              onOpenChange={(o) => !isDeleting && setConfirmOpen(o)}
            >
              <AlertDialogTrigger asChild>
                <AppButton
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                  onClick={() => setConfirmOpen(true)}
                >
                  Deletar
                </AppButton>
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Essa ação não pode ser desfeita. Isso vai remover{" "}
                    <b>{data.title}</b> permanentemente.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel
                    disabled={isDeleting}
                    className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                  >
                    Cancelar
                  </AlertDialogCancel>

                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground"
                    disabled={isDeleting}
                    onClick={async (e) => {
                      e.preventDefault();
                      await handleConfirmDelete();
                    }}
                  >
                    {isDeleting ? "Deletando..." : "Confirmar"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AppButton variant="brand" onClick={() => setOpenEdit(true)}>
              Editar
            </AppButton>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,260px)_1fr_minmax(0,320px)]">
          <div className="rounded-xl border border-white/10 bg-black/90 p-2">
            <img
              src={data.posterUrl}
              alt={data.title}
              className="w-full rounded-lg object-cover"
            />
          </div>

          <div className="rounded-xl border border-white/10 bg-black/90 p-4">
            <p className="text-mauve-10">{data.tagline}</p>

            <div className="mt-8">
              <h3 className="text-sm text-mauve-11">SINOPSE</h3>
              <p className="mt-2 leading-relaxed text-mauve-12/90">
                {data.overview}
              </p>
            </div>

            <div className="mt-5">
              <h3 className="text-sm text-mauve-11">Gêneros</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {data.rawGenres.map((g) => (
                  <span
                    key={g.id}
                    className="rounded-md border border-purple-10/30 bg-purple-3/30 px-2.5 py-1 text-xs text-white"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative grid grid-cols-2 gap-3 pr-20">
              <Metric label="POPULARIDADE" value="—" />
              <Metric label="VOTOS" value="—" />
              {data.approbation != null && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2">
                  <ScoreCard percent={data.approbation} />
                </div>
              )}
            </div>

            <div className="mt-8 grid gap-3">
              <div className="grid grid-cols-2 gap-3">
                <Metric label="LANÇAMENTO" value={releaseDisplay} />
                <Metric
                  label="DURAÇÃO"
                  value={formatRuntime(data.runtimeMinutes)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Metric label="SITUAÇÃO" value={data.status ?? "-"} />
                <Metric label="IDIOMA" value={data.originalLanguage ?? "-"} />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <Metric
                  label="ORÇAMENTO"
                  value={moneyUSD(strCurrencyToNumber(data.budget))}
                />
                <Metric
                  label="RECEITA"
                  value={moneyUSD(strCurrencyToNumber(data.revenue))}
                />
                <Metric
                  label="LUCRO"
                  value={moneyUSD(
                    (strCurrencyToNumber(data.revenue) ?? 0) -
                      (strCurrencyToNumber(data.budget) ?? 0)
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Trailer</h2>
          <div className="aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-black/30">
            <iframe
              className="h-full w-full"
              src={
                data.trailerUrl
                  ? `https://www.youtube.com/embed/${data.trailerUrl}?rel=0`
                  : undefined
              }
              title={`${data.title} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        </section>
      </div>
      <FormMoviesData
        open={openEdit}
        onOpenChange={setOpenEdit}
        onSubmit={handleEditMovie}
        defaultValues={data}
        mode="edit"
      />
    </div>
  );
};

export default MovieDetails;
