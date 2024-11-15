import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { StarDetail } from "../../interfaces/star";
import { isUserLoggedIn } from "~/api/login";
import { useRouter } from "next/router";
import { fetchStarById } from "~/api/stars";
import { CardBody, CardContainer, CardItem } from "../../components/ui/3d-card";
import { Loading } from "~/components/navigation/loading";

import { MoviesBentoGrid } from "~/components/bento-grid";

const SingleStarPage: React.FC = () => {
  const [star, setStar] = useState<StarDetail | null>(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    isUserLoggedIn().then(({ isLoggedIn }) => {
      if (!isLoggedIn) {
        router.push("/login");
      } else if (router.query.id) {
        fetchStarById(router.query.id as string).then((fetchedStar) => {
          fetchedStar?.movies.sort((a, b) => {
            if (a.year !== b.year) {
              return b.year - a.year;
            }
            return a.title.localeCompare(b.title);
          });
          setStar(fetchedStar);
          setIsLoading(false);
        });
      }
    });
  }, [router]);

  useEffect(() => {
    // console.log(star);
  }, [star]);

  if (isLoading) return <Loading />;
  if (!star) return <div>No star found...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>{star?.name}</title>
      </Head>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4">{star?.name}</h1>
        <div className="text-lg space-y-2">
          <h1 className="text-2xl font-bold">{star?.name}</h1>
          <p className="text-gray-400">
            DOB: <span className="font-semibold">{star?.birthYear}</span>
          </p>
        </div>
      </div>
      <h1 className="text-xl font-bold text-center mb-4">Movies</h1>
      <MoviesBentoGrid movies={star.movies} />
      {/* <div className="max-w-4xl mx-auto flex flex-wrap justify-start items-start">
        {star?.movies.map((movie) => (
          <CardContainer key={movie.id} className="w-full">
            <CardBody className="bg-gray-50 relative group dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] mx-2 rounded-xl p-6 border">
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
                  Learn More About {movie.title}→
                </CardItem>
                <CardItem translateZ={20} className="text-xs font-bold">
                  {movie.rating.toFixed(1)}
                </CardItem>
              </div>
            </CardBody>
          </CardContainer>
        ))}
      </div> */}
    </div>
  );
};

export default SingleStarPage;
