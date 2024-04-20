import React, { useEffect, useState } from "react";
import Head from "next/head";
import { Movie } from "~/interfaces/movie";
import { fetchTopMovies } from "../../services/movies";
import MovieCard from "~/components/MovieCard";
import { handleAddToCart, handleEditFromCart } from "../../services/carts";
const MovieListPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<Boolean>(true);
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    fetchTopMovies().then((movies) => {
      console.log("data", movies);
      setMovies(movies);
      setIsLoading(false);
    });
  }, []);

  const updateMovies = () => {
    alert("Item Added to the cart.");
  };

  console.log(isLoading);

  if (isLoading) return <div>Loading...</div>;
  return (
    <div className="mx-auto px-4 bg-background">
      <Head>
        <title>Movie List</title>
      </Head>
      <h1 className="text-2xl font-bold my-6">Top 20 Rated Movies</h1>
      <div className="flex flex-wrap justify-around items-start">
        {movies.map((movie) => (
          <MovieCard
            movie={movie}
            isCartPage={false}
            handleAddToCart={() => handleAddToCart(movie.id, updateMovies)}
            updateMovies={updateMovies}
          />
        ))}
      </div>
    </div>
  );
};

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const session = await getSession(context);
//   console.log("session", session);
//   if (!session) {
//     return {
//       redirect: {
//         destination: "/login",
//         permanent: false,
//       },
//     };
//   }

//   return { props: {} };
// };

export default MovieListPage;
