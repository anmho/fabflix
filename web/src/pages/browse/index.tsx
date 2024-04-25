import Link from "next/link";
import { useEffect, useState } from "react";
import { ComboboxDemo } from "~/components/combobox";
import { Button } from "~/components/ui/button";
import { Genre } from "~/interfaces/movie";
import { getGenres } from "~/api/genres";

const startsWithOptions = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "*",
];

const BrowseMoviesPage: React.FC = () => {
  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
    getGenres().then((genres) => setGenres(() => genres));
  }, []);

  return (
    <>
      <div className="flex justify-center items-center flex-wrap">
        {startsWithOptions.map((letter, i) => (
          <Link key={i} href={`/search?starts-with=${letter.toLowerCase()}`}>
            <Button className="p-2 bg-red-500 rounded-md m-1">{letter}</Button>
          </Link>
        ))}
      </div>
      <div className=" flex justify-center items-center flex-wrap ">
        {genres.map((genre, i) => (
          <Link key={i} href={`/search?genre=${genre.name.toLowerCase()}`}>
            <Button className="bg-green-500 m-1 p-2 rounded-md text-primary">
              {genre.name}
            </Button>
          </Link>
        ))}
      </div>
    </>
  );
};

export default BrowseMoviesPage;
