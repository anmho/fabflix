import React from "react";
import Head from "next/head";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { StarDetail } from "../../interfaces/star";

interface SingleStarPageProps {
  star: StarDetail;
}

const SingleStarPage: React.FC<SingleStarPageProps> = ({ star }) => {
  return (
    <div>
      <Head>
        <title>{star.name}</title>
      </Head>
      <h1>Star Name: {star.name}</h1>
      <p>Year of Birth: {star.yearOfBirth || "N/A"}</p>
      <div>
        <h2>Movies:</h2>
        <ul>
          {star.movies.map((movie) => (
            <li key={movie.id}>
              <Link href={`/movie/${movie.id}`}>{movie.title}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };

  const star: StarDetail = {
    id: parseInt(id),
    name: "Dummy Star Name",
    yearOfBirth: 1980,
    movies: [
      {
        id: 1,
        title: "Movie One",
        year: 2000,
        director: "Director One",
        genres: [],
        stars: [],
        rating: 8.0,
      },
      {
        id: 2,
        title: "Movie Two",
        year: 2005,
        director: "Director Two",
        genres: [],
        stars: [],
        rating: 7.5,
      },
    ],
  };

  return { props: { star } };
};

export default SingleStarPage;
