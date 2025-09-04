import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router";
import { AppButton } from "@/components/Button";
import { fetchMockMovies } from "@/service/movies";
import type { MovieDetailsData } from "./types";
import { buildDetails } from "./mock";
import { formatRuntime, moneyUSD } from "./utils";
import { Metric } from "./components/Metrics";

export const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<MovieDetailsData | null>(null);

  useEffect(() => {
    fetchMockMovies().then((all) => {
      const base = all.find((m) => String(m.id) === id);
      if (!base) return setData(null);
      setData(buildDetails(base));
    });
  }, [id]);

  const pct: number | null = useMemo(() => {
    if (data?.rating == null || Number.isNaN(data.rating)) return null;
    return Math.max(0, Math.min(100, Math.round(data.rating)));
  }, [data?.rating]);

  const r = 18;
  const c = 2 * Math.PI * r;
  const dash = pct != null ? (pct / 100) * c : 0;

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
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/65" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[--bg]" />
      </div>

      <div className="mx-auto w-full max-w-[1200px] px-4 py-6 space-y-8">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-3xl font-bold text-white">{data.title}</h1>
          <div className="flex items-center gap-3">
            <AppButton
              variant="secondary"
              className="bg-mauve-6/40 border border-mauve-10/30 text-mauve-12 hover:bg-mauve-7/40"
            >
              Deletar
            </AppButton>
            <AppButton asChild>
              <Link to={`/movies/${id}/edit`}>Editar</Link>
            </AppButton>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,260px)_1fr_minmax(0,280px)]">
          <div className="rounded-xl border border-white/10 bg-black/30 p-2">
            <img
              src={data.posterUrl}
              alt={data.title}
              className="w-full rounded-lg object-cover"
            />
          </div>

          <div className="rounded-xl border border-white/10 bg-black/30 p-4">
            <p className="text-mauve-10">{data.tagline}</p>

            <div className="mt-5">
              <h3 className="text-sm text-mauve-11">SINOPSE</h3>
              <p className="mt-2 leading-relaxed text-mauve-12/90">
                {data.overview}
              </p>
            </div>

            <div className="mt-5">
              <h3 className="text-sm text-mauve-11">Gêneros</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {data.genres.map((g) => (
                  <span
                    key={g}
                    className="rounded-md border border-purple-10/30 bg-purple-3/30 px-2.5 py-1 text-xs text-white"
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 self-start md:grid-cols-2">
            <Metric label="POPULARIDADE" value="42,595" />
            <Metric label="VOTOS" value="5704" />
            <div className="rounded-xl border border-white/10 bg-black/30 p-3 flex items-center justify-between">
              <span className="text-xs text-mauve-11">NOTA</span>
              <div className="relative grid place-items-center">
                <svg width="56" height="56" viewBox="0 0 44 44">
                  <circle
                    cx="22"
                    cy="22"
                    r={r}
                    stroke="rgba(255,255,255,0.18)"
                    strokeWidth="4"
                    fill="none"
                  />
                  <circle
                    cx="22"
                    cy="22"
                    r={r}
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={`${dash} ${c - dash}`}
                    className="text-yellow-400"
                    fill="none"
                  />
                </svg>
                <span className="absolute text-xs font-semibold text-white">
                  {pct ?? 0}%
                </span>
              </div>
            </div>
            <Metric
              label="LANÇAMENTO"
              value={data.releaseDate?.split("-").reverse().join("/")}
            />
            <Metric
              label="DURAÇÃO"
              value={formatRuntime(data.runtimeMinutes)}
            />
            <Metric label="SITUAÇÃO" value={data.status ?? "-"} />
            <Metric label="IDIOMA" value={data.originalLanguage ?? "-"} />
            <Metric label="ORÇAMENTO" value={moneyUSD(data.budget)} />
            <Metric label="RECEITA" value={moneyUSD(data.revenue)} />
            <Metric
              label="LUCRO"
              value={moneyUSD((data.revenue ?? 0) - (data.budget ?? 0))}
            />
          </div>
        </div>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Trailer</h2>
          <div className="aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-black/30">
            <iframe
              className="h-full w-full"
              src={`https://www.youtube.com/embed/${data.trailerYouTubeId}?rel=0`}
              title={`${data.title} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default MovieDetails;
