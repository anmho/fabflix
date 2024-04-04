export interface Genre {
  id: number;
  name: string;
}

export interface Star {
  id: number;
  name: string;
  url: string;
}

export interface Movie {
  id: number;
  title: string;
  year: number;
  director: string;
  genres: Genre[];
  stars: Star[];
  rating: number;
}
