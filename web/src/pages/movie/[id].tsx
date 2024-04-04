import React from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { Movie } from "../../interfaces/movie";
import { StarDetail } from "../../interfaces/star";
import { GetServerSideProps } from "next";

interface SingleMoviePageProps {
  movie: Movie;
}

const SingleMoviePage: React.FC<SingleMoviePageProps> = ({ movie }) => {
  return (
    <div className="min-h-screen p-8">
      <Head>
        <title>{movie?.title}</title>
      </Head>
      <div className="container mx-auto p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-2">
          {movie?.title} ({movie?.year})
        </h1>
        <div className="flex flex-wrap md:flex-nowrap">
          <div className="w-full md:w-2/3">
            <p className="font-semibold">Director:</p>
            <p>{movie?.director}</p>
            <p className="font-semibold mt-4">Genres:</p>
            <p>{movie?.genres.map((genre) => genre.name).join(", ")}</p>
            <p className="font-semibold mt-4">Stars:</p>
            <p>
              {movie?.stars.map((star, index) => (
                <React.Fragment key={star.id}>
                  {index > 0 && ", "}
                  <a
                    href={star.url}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    {star.name}
                  </a>
                </React.Fragment>
              ))}
            </p>
            <p className="font-semibold mt-4">Rating:</p>
            <p className="mb-4">{movie?.rating}</p>
            <p className="font-semibold">Story:</p>
            <p>
              A description of the movie goes here. It's a placeholder for the
              actual movie description.
            </p>
          </div>
          <div className="w-full md:w-1/3 mt-6 md:mt-0 md:ml-6">
            <img
              src="https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p11580277_v_h9_ae.jpg"
              alt="Movie poster"
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export const getServerSideProps: GetServerSideProps = async (context) => {
  const movie: Movie = {
    id: 1,
    title: "Dummy Movie Title",
    year: 2021,
    director: "Jane Doe",
    genres: [
      { id: 1, name: "Adventure" },
      { id: 2, name: "Action" },
      { id: 3, name: "Comedy" },
    ],
    stars: [
      { id: 1, name: "Star One", url: "/star/1" },
      { id: 2, name: "Star Two", url: "/star/2" },
      { id: 3, name: "Star Three", url: "/star/3" },
    ],
    rating: 8.5,
  };

  return { props: { movie } };
};

export default SingleMoviePage;
