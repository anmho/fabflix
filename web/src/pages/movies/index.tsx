import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { Movie } from "~/interfaces/movie";
import { fetchTopMovies } from "../../services/movies";
import { CardBody, CardContainer, CardItem } from "../../components/ui/3d-card";

const MovieListPage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    fetchTopMovies().then((movies) => {
      setMovies(movies);
    });
  }, []);

  return (
    <div className="mx-auto px-4 bg-background">
      <Head>
        <title>Movie List</title>
      </Head>
      <h1 className="text-2xl font-bold my-6">Top 20 rated movies</h1>
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
              {/* <CardItem translateZ="100" className="w-full mt-4">
                <Image
                  src="/path/to/movie/image.jpg" // Placeholder, replace with actual movie image path
                  height="400"
                  width="300"
                  className="h-60 w-full object-cover rounded-xl group-hover:shadow-xl"
                  alt="Movie Thumbnail"
                />
              </CardItem> */}
              <CardItem
                as="p"
                translateZ="30"
                className="text-neutral-500 text-sm mt-2 dark:text-neutral-300"
              >
                Actors:{" "}
                {movie?.stars.slice(0, 3).map((star, index, slicedArray) => (
                  <span key={star.id}>
                    <Link
                      href={`stars/${star?.id}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {star?.name}
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
                {movie?.genres.slice(0, 3).map((genre, index, slicedArray) => (
                  <span key={genre.id}>
                    {/* <Link
                      href={`stars/${genre?.id}`}
                      className="text-blue-600 hover:text-blue-800"
                    > */}
                    {genre?.name}
                    {/* </Link> */}
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
                  Learn More About {movie?.title}→
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

export default MovieListPage;
