import { StarDetail } from "~/interfaces/star";

// export const fetchStarById = async (id: string): Promise<StarDetail> => {
//   console.log("id", id);
//   const starResponse = await fetch(`http://localhost:8080/api/stars?id=${id}`);
//   const movieResponse = await fetch(
//     `http://localhost:8080/api/movies?starId=${id}`
//   );

//   // should use zod
//   const star: { id: string; name: string; birthYear: number | "N/A" } =
//     await starResponse.json();
//   const movies = await movieResponse.json();

//   star.birthYear = star.birthYear || "N/A";

//   const starDetails: StarDetail = {
//     ...star,
//     movies: movies,
//   };

//   console.log("starDetails", starDetails);

//   return starDetails;
// };
