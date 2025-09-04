import type { MovieMock } from "@/service/movies";
import type { MovieDetailsData } from "../types";

export const buildDetails = (m: MovieMock): MovieDetailsData => ({
  ...m,
  originalTitle: m.title,
  tagline: "Todo herói tem um começo.",
  overview:
    "“Bumblebee” é um filme que se passa em 1987 e conta a história de um Autobot chamado Bumblebee que encontra refúgio em um ferro-velho de uma pequena cidade praiana da Califórnia. Charlie, uma adolescente prestes a completar 18 anos, encontra Bumblebee machucado e sem condições de uso. Quando o repara, ele percebe que não é qualquer fusca amarelo.",
  releaseDate: "2018-12-20",
  runtimeMinutes: 113,
  status: "Lançado",
  originalLanguage: "Inglês",
  budget: 135_000_000,
  revenue: 467_989_645,
  backdropUrl: m.posterUrl,
  trailerYouTubeId: "lcwmDAYt22k",
});
