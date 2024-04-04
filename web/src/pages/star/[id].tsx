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
    <div className="min-h-screen p-8">
      <Head>
        <title>{star.name}</title>
      </Head>
      <div className="container mx-auto p-6 rounded-lg shadow-lg">
        <div className="bg-teal-500 rounded-t-lg p-4">
          <h1 className="text-2xl font-bold">{star.name} (N/A)</h1>
        </div>
        <table className="lg:min-w-[600px] min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-teal-500 text-left text-xs font-semibold  uppercase tracking-wider">
                Movie Title
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-teal-500 text-left text-xs font-semibold  uppercase tracking-wider">
                Release Year
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-teal-500 text-left text-xs font-semibold  uppercase tracking-wider ">
                Director
              </th>
            </tr>
          </thead>
          <tbody>
            {star.movies.map((movie) => (
              <tr key={movie.id}>
                <td className="px-5 py-5 border-b border-gray-200  text-sm">
                  <Link
                    href={`/movie/${movie.id}`}
                    className="text-teal-600 hover:text-teal-900"
                  >
                    {movie.title}
                  </Link>
                </td>
                <td className="px-5 py-5 border-b border-gray-200  text-sm">
                  {movie.year}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                  {movie.director}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
