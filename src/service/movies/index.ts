export type MovieMock = {
  id: number | string;
  title: string;
  posterUrl: string;
  year: number;
  genres: string[];
  rating: number;
};

const poster = (title: string) =>
  `https://placehold.co/400x600/1f1b24/ffffff?text=${encodeURIComponent(
    title
  )}`;

export const MOVIES_MOCK: MovieMock[] = [
  {
    id: 1,
    title: "Bumblebee",
    posterUrl: poster("Bumblebee"),
    year: 2018,
    genres: ["Ação", "Aventura", "Ficção científica"],
    rating: 67,
  },
  {
    id: 2,
    title: "Capitã Marvel",
    posterUrl: poster("Capitã Marvel"),
    year: 2019,
    genres: ["Ação", "Aventura"],
    rating: 64,
  },
  {
    id: 3,
    title: "Alita: Anjo de Combate",
    posterUrl: poster("Alita: Anjo de Combate"),
    year: 2019,
    genres: ["Ação", "Ficção científica"],
    rating: 72,
  },
  {
    id: 4,
    title: "Como Treinar o Seu Dragão 3",
    posterUrl: poster("Como Treinar o Seu Dragão 3"),
    year: 2019,
    genres: ["Animação", "Aventura", "Família"],
    rating: 78,
  },
  {
    id: 5,
    title: "Aquaman",
    posterUrl: poster("Aquaman"),
    year: 2018,
    genres: ["Ação", "Aventura", "Fantasia"],
    rating: 69,
  },
  {
    id: 6,
    title: "O Menino que Queria Ser Rei",
    posterUrl: poster("O Menino que Queria Ser Rei"),
    year: 2019,
    genres: ["Aventura", "Família", "Fantasia"],
    rating: 60,
  },
  {
    id: 7,
    title: "Megarrromântico",
    posterUrl: poster("Megarrromântico"),
    year: 2019,
    genres: ["Comédia", "Romance"],
    rating: 62,
  },
  {
    id: 8,
    title: "Uma Nova Chance",
    posterUrl: poster("Uma Nova Chance"),
    year: 2018,
    genres: ["Comédia", "Romance"],
    rating: 57,
  },
  {
    id: 9,
    title: "Homem-Aranha no Aranhaverso",
    posterUrl: poster("Homem-Aranha no Aranhaverso"),
    year: 2018,
    genres: ["Animação", "Ação", "Aventura"],
    rating: 92,
  },
  {
    id: 10,
    title: "Máquinas Mortais",
    posterUrl: poster("Máquinas Mortais"),
    year: 2018,
    genres: ["Ação", "Aventura", "Fantasia"],
    rating: 55,
  },
  {
    id: 11,
    title: "Duna",
    posterUrl: poster("Duna"),
    year: 2021,
    genres: ["Ficção científica", "Aventura"],
    rating: 84,
  },
  {
    id: 12,
    title: "Oppenheimer",
    posterUrl: poster("Oppenheimer"),
    year: 2023,
    genres: ["Drama", "Biografia"],
    rating: 86,
  },
];

export const fetchMockMovies = (delayMs = 500): Promise<MovieMock[]> => {
  return new Promise((resolve) =>
    setTimeout(() => resolve(MOVIES_MOCK), delayMs)
  );
};
