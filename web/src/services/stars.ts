import { StarDetail } from "~/interfaces/star";

export const fetchStarById = async (id: string): Promise<StarDetail | null> => {
  console.log("id", id);
  const [starResponse, movieResponse] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/stars?id=${id}`),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/movies?starId=${id}`),
  ]);

  if (!starResponse.ok || !movieResponse.ok) {
    return null;
  }

  // should use zod
  const star: { id: string; name: string; birthYear: number | "N/A" } =
    await starResponse.json();
  const movies = await movieResponse.json();

  star.birthYear = star.birthYear || "N/A";

  const starDetails: StarDetail = {
    ...star,
    movies: movies,
  };

  console.log("starDetails", starDetails);

  return starDetails;
};
