import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Genre } from "~/interfaces/genre";
import { getGenres } from "~/api/genres";
import { PrivatePage } from "~/components/auth/private-page";
import { Badge } from "~/components/ui/badge";
import { useTheme } from "next-themes";
import { cn } from "~/lib/utils";

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

  const { theme } = useTheme();

  return (
    <div className="xl:max-w-[1440px] w-full flex flex-col text-center sm:px-20 px-5 justify-center">
      <div>
        <h1 className="text-6xl mb-4 items-left flex">Browse</h1>
        <h3 className="text-3xl my-3">Genres</h3>
        <div className=" flex justify-center items-center flex-wrap">
          <Link href={"/search"}>
            <Badge
              className={cn(
                theme,
                "bg-primary text-primary-foreground py-1 px-2 m-1"
              )}
            >
              All
            </Badge>
          </Link>
          {genres.map((genre, i) => (
            <Link key={i} href={`/search?genre=${genre.name.toLowerCase()}`}>
              <Badge
                className={cn(theme, "text-primary-foreground py-1 px-2 m-1")}
              >
                {genre.name}
              </Badge>
            </Link>
          ))}
        </div>
      </div>
      <div>
        <h1 className="text-4xl mb-4 mt-10">Browse by title</h1>
        <p className="text-black">
          {JSON.stringify(console.log(startsWithOptions))}
        </p>
        {startsWithOptions.map((letter, i) => (
          <Link key={i} href={`/search?startsWith=${letter}`}>
            <Button
              className={cn(
                theme,
                "border border-border h-36 w-36 bg-background text-foreground rounded-xl m-1 "
              )}
            >
              <h1 className="text-3xl ">{letter}</h1>
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
};

// export default PrivatePage(<BrowseMoviesPage />);
// export default (children: ReactNode) => PrivatePage({ children: <BrowseMoviesPage /> });
export default BrowseMoviesPage;
// export default PrivatePage({ children: <BrowseMoviesPage /> });
