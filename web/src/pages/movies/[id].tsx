import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Movie } from "~/interfaces/movie";
import { getMovieById as fetchMovieById } from "~/api/movies";
import { isUserLoggedIn } from "~/api/login";
import { Loading } from "~/components/navigation/loading";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { useTheme } from "next-themes";
import { addMovieToCart } from "~/api/cart";
import { updateMovies } from ".";
import { cn } from "~/utils/cn";
const SingleMoviePage: React.FC = () => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    isUserLoggedIn().then(({ isLoggedIn }) => {
      if (!isLoggedIn) {
        router.push("/login");
      } else if (router.query.id) {
        fetchMovieById(router.query.id as string).then((movie) => {
          movie.genres.sort((a, b) => {
            return a.name.localeCompare(b.name);
          });
          movie.stars.sort((a, b) => {
            if (b.numMovies - a.numMovies === 0) {
              return a.name.localeCompare(b.name);
            }
            return b.numMovies - a.numMovies;
          });
          setMovie(movie);
          setIsLoading(false);
        });
      }
    });
  }, [router]);

  if (isLoading) return <Loading />;
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
            {movie.genres.map((genre) => (
              <Badge
                key={genre.id}
                className="m-[2px] hover:cursor-pointer"
                onClick={() => {
                  window.location.href = `/search?genre=${genre.name.toLowerCase()}`;
                }}
              >
                {genre.name}
              </Badge>
            ))}
          </p>
          <p className="text-gray-400">
            Stars:
            {movie.stars.map((star, index) => (
              <Badge
                key={star.id}
                className="bg-background border-border text-foreground mr-1"
              >
                <Link href={`/stars/${star.id}`}>
                  {star.name}{" "}
                  {`(${star?.birthYear > 0 ? star?.birthYear : "N/A"})`}{" "}
                  {star.numMovies}{" "}
                </Link>
              </Badge>
            ))}
          </p>
          <p className="text-gray-400">
            Rating: <span className="font-semibold">{movie?.rating}</span>
          </p>
          <Button
            className={cn(theme, "bottom-0 border border-border w-full")}
            onClick={() =>
              addMovieToCart(movie.id, () => updateMovies(movie.title))
            }
          >
            Add to cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SingleMoviePage;
