import React, { useEffect, useState } from "react";
import Head from "next/head";
import { Movie } from "~/interfaces/movie";
import { fetchTopMovies } from "../../api/movies";
import { MovieCard } from "~/components/MovieCard";
import { handleAddToCart, handleEditFromCart } from "../../api/cart";
import { isLoggedIn } from "~/api/login";
import { useRouter } from "next/router";
import { toast } from "sonner";

export const updateMovies = (movieName: string) => {
  toast(`"${movieName}" added to your shopping cart.`);
};

const MovieListPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<Boolean>(true);
  const [movies, setMovies] = useState<Movie[]>([]);
  const router = useRouter();

  useEffect(() => {
    isLoggedIn().then(({ success }) => {
      if (!success) {
        router.push("/login");
      } else {
        fetchTopMovies().then((movies) => {
          setMovies(movies);
          setIsLoading(false);
        });
      }
    });
  }, [router]);

  if (isLoading) return <div>Loading...</div>;
  return (
    <div className="mx-auto px-4 bg-background">
      <Head>
        <title>Movie List</title>
      </Head>
      <h1 className="text-2xl font-bold my-6">Top 20 Rated Movies</h1>
      <div className="flex flex-wrap justify-around items-start">
        {movies.map((movie, i) => (
          <MovieCard
            key={i}
            movie={movie}
            isCartPage={false}
            handleAddToCart={() =>
              handleAddToCart(movie.id, () => updateMovies(movie.title))
            }
            updateMovies={() => {}}
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
