import { handleAddToCart } from "~/services/carts";
import MovieCard from "./MovieCard";

interface MoviesGridProps {}

// export function MoviesGrid({ movies }: MoviesGridProps) {
//   return (
//     <div className="flex flex-wrap justify-around items-start">
//       {movies.map((movie) => (
//         <MovieCard
//           movie={movie}
//           isCartPage={false}
//           handleAddToCart={() => handleAddToCart(movie.id, updateMovies)}
//           updateMovies={updateMovies}
//         />
//       ))}
//     </div>
//   );
// }
