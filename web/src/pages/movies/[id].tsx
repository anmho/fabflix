import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Movie } from '~/interfaces/movie';

const SingleMoviePage: React.FC = () => {
  const fetchMovie = async (movieID: string): Promise<Movie> => {
    const res = await fetch(`http://localhost:8080/api/movies?id=${movieID}`);
    const movie = await res.json();
    setIsLoading(false);
    console.log(movie);
    return movie;
  };
  const [movie, setMovie] = useState<Movie | null>(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (router.query.id) {
      fetchMovie(router.query.id as string).then(setMovie);
    }
  }, [router.query.id]);

  if (isLoading) return <div>Loading...</div>;
  if (!movie) return <div>NO MOVIE HAS FOUND...</div>;

  return (
    <div className="container mx-auto px-4">
      <Head>
        <title>{movie?.title}</title>
      </Head>
      <div>
        <h1 className="text-3xl font-bold">
          {movie?.title} ({movie?.year})
        </h1>
        <p>Director: {movie?.director}</p>
        <p>Genres: {movie?.genres.map((genre) => genre.name).join(', ')}</p>
        <p>
          Stars:{' '}
          {movie?.stars.map((star, index) => (
            <React.Fragment key={star?.id}>
              {index > 0 ? ', ' : ''}
              <Link
                className="text-blue-500 hover:underline"
                href={`/stars/${star?.id}`}
              >
                {star.name} {`(${star.birthYear > 0 ? star.birthYear : 'N/A'})`}
              </Link>
            </React.Fragment>
          ))}
        </p>
        <p>Rating: {movie?.rating}</p>
      </div>
    </div>
  );
};

export default SingleMoviePage;
