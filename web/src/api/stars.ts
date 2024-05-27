import { StarDetail } from "~/interfaces/star";
import { getApiClient } from "./http";

export const fetchStarById = async (id: string): Promise<StarDetail | null> => {
  const api = getApiClient();
  try {
    const [starResponse, movieResponse] = await Promise.all([
      api.get(`/stars?id=${id}`),
      api.get(`/movies?starId=${id}`),
      // fetch(`${process.env.NEXT_PUBLIC_API_URL}/stars?id=${id}`, {
      //   credentials: "include",
      // }),
      // fetch(`${process.env.NEXT_PUBLIC_API_URL}/movies?starId=${id}`, {
      //   credentials: "include",
      // }),
    ]);

    // if (!starResponse.ok || !movieResponse.ok) {
    //   return null;
    // }

    // should use zod
    const star: { id: string; name: string; birthYear: number | "N/A" } =
      await starResponse.data;
    const movies = await movieResponse.data;

    star.birthYear = star.birthYear || "N/A";

    const starDetails: StarDetail = {
      ...star,
      movies: movies,
    };

    return starDetails;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export interface StarParams {
  name: string;
  birthYear?: number;
}

export interface StarResponse {
  numMovies?: number;
  id?: string;
  name?: string;
  birthYear?: number;
  message: string;
  status: number;
}

export async function addStar(starData: StarParams): Promise<StarResponse> {
  const { name, birthYear } = starData;
  const queryParams = new URLSearchParams();
  if (name) queryParams.append("name", name);
  if (birthYear) queryParams.append("birthYear", birthYear.toString());
  const http = getApiClient();

  const response = await http.post("/addStar", starData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return { ...response.data, status: 200, message: "Star successfully added." };
}
