import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { Movie } from "../interfaces/movie";

const dummyMovies: Movie[] = Array.from({ length: 20 }).map((_, index) => ({
  id: index + 1,
  title: `Movie Title ${index + 1}`,
  year: 2000 + index,
  director: `Director ${index + 1}`,
  genres: [
    { id: index * 3 + 1, name: "Genre 1" },
    { id: index * 3 + 2, name: "Genre 2" },
    { id: index * 3 + 3, name: "Genre 3" },
  ],
  stars: [
    { id: index * 3 + 1, name: "Star 1", url: `/star/${index * 3 + 1}` },
    { id: index * 3 + 2, name: "Star 2", url: `/star/${index * 3 + 2}` },
    { id: index * 3 + 3, name: "Star 3", url: `/star/${index * 3 + 3}` },
  ],
  rating: 7.5 + index * 0.1,
}));

const fetchMovies = async (): Promise<Movie[]> => {
  const res = await fetch('http://localhost:8080/api/movies');
  
  const movies = await res.json();
  console.log('res', res);
  console.log('movies', movies)


  return dummyMovies;
};


const MovieListPage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    console.log('fetch')
    fetchMovies().then((movies) => {
      setMovies(movies);
    });
  }, []);

  return (
    <div className="container mx-auto px-4">
      <Head>
        <title>Movie List</title>
      </Head>
      <h1 className="text-2xl font-bold my-6">Top 20 rated movies</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="border-b">
            <tr>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">
                Year
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">
                Director
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">
                Genres
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">
                Stars
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">
                Rating
              </th>
            </tr>
          </thead>
          <tbody>
            {movies.map((movie) => (
              <tr key={movie.id} className="border-b">
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                  <Link
                    href={`/movie/${movie.id}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {movie.title}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                  {movie.year}
                </td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                  {movie.director}
                </td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                  {movie.genres.map((genre) => genre.name).join(", ")}
                </td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                  {movie.stars.map((star, index) => (
                    <span key={star.id}>
                      <Link
                        href={star.url}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {star.name}
                      </Link>
                      {index < movie.stars.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                  {movie.rating.toFixed(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MovieListPage;
