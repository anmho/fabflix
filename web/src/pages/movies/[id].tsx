import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Movie } from "~/interfaces/movie";
import { getMovieById as fetchMovieById } from "~/services/movies";

const SingleMoviePage: React.FC = () => {
  // const fetchMovie = async (movieID: string): Promise<Movie> => {
  //   const res = await fetch(`http://localhost:8080/api/movies?id=${movieID}`);
  //   const movie = await res.json();
  //   // setIsLoading(false);
  //   console.log(movie);
  //   return movie;
  // };

  const [movie, setMovie] = useState<Movie | null>(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (router.query.id) {
      fetchMovieById(router.query.id as string).then(setMovie);
      setIsLoading(false);
    }
  }, [router.query.id]);

  if (isLoading) return <div>Loading...</div>;
  if (!movie) return <div>NO MOVIE HAS FOUND...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>{movie?.title}</title>
      </Head>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4">
          {movie?.title} ({movie?.year})
        </h1>
        <div className="text-lg space-y-2">
          <h1 className="text-2xl font-bold">{movie?.title}</h1>
          <p className="text-gray-400">
            Year: <span className="font-semibold">{movie?.year}</span>
          </p>
          <p className="text-gray-400">
            Director: <span className="font-semibold">{movie?.director}</span>
          </p>
          <p className="text-gray-400">
            Genres:{" "}
            <span className="font-semibold">
              {movie?.genres.map((genre) => genre.name).join(", ")}
            </span>
          </p>
          <p className="text-gray-400">
            Stars:{" "}
            {movie?.stars.map((star, index) => (
              <React.Fragment key={star?.id}>
                {index > 0 && ", "}
                <Link
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-200 ease-in-out"
                  href={`/stars/${star?.id}`}
                >
                  {star.name}{" "}
                  {`(${star?.birthYear > 0 ? star?.birthYear : "N/A"})`}
                </Link>
              </React.Fragment>
            ))}
          </p>
          <p className="text-gray-400">
            Rating: <span className="font-semibold">{movie?.rating}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SingleMoviePage;
