export interface Genre {
  id: number;
  name: string;
}

export interface Star {
  birthYear: number;
  id: number;
  name: string;
  url: string;
}

export interface Movie {
  id: string;
  title: string;
  year: number;
  director: string;
  genres: Genre[];
  stars: Star[];
  rating: number;
  quantity: number;
  price: number;
}
