import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { Movie } from "~/interfaces/movie";
import { fetchTopMovies } from "../../services/movies";
import { CardBody, CardContainer, CardItem } from "../../components/ui/3d-card";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";

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
          <CardContainer key={movie.id} className="w-full">
            <CardBody className="fg-primary relative group dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] mx-2 rounded-xl p-6 border">
              <CardItem
                translateZ="50"
                className="text-xl font-bold text-neutral-600 dark:text-white"
              >
                {movie.title}
              </CardItem>
              <CardItem
                as="p"
                translateZ="30"
                className="text-neutral-500 text-sm dark:text-neutral-300"
              >
                {`${movie.year} • ${movie.director}`}
              </CardItem>
              <CardItem
                as="p"
                translateZ="30"
                className="text-neutral-500 text-sm mt-2 dark:text-neutral-300"
              >
                Actors:{" "}
                {movie.stars.slice(0, 3).map((star, index, slicedArray) => (
                  <span key={star.id}>
                    <Link
                      href={`/stars/${star.id}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {star.name}
                    </Link>
                    {index < slicedArray.length - 1 ? ", " : ""}
                  </span>
                ))}
              </CardItem>
              <CardItem
                as="p"
                translateZ="30"
                className="text-neutral-500 text-sm mt-2 dark:text-neutral-300"
              >
                Genres:{" "}
                {movie.genres.slice(0, 3).map((genre, index, slicedArray) => (
                  <span key={genre.id}>
                    {genre.name}
                    {index < slicedArray.length - 1 ? ", " : ""}
                  </span>
                ))}
              </CardItem>
              <div className="flex justify-between items-center mt-4">
                <CardItem
                  translateZ={20}
                  as={Link}
                  href={`/movies/${movie.id}`}
                  className="rounded-xl text-xs font-normal dark:text-white hover:text-blue-500"
                >
                  Learn More About {movie.title} →
                </CardItem>
                <CardItem translateZ={20} className="text-xs font-bold">
                  {movie.rating.toFixed(1)}
                </CardItem>
              </div>
            </CardBody>
          </CardContainer>
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
