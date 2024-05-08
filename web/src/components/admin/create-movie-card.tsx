import { fromError } from "zod-validation-error";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { GenreDropdownInput } from "./genre-dropdown";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getGenres } from "~/api/genres";
import { Loading } from "../navigation/loading";
import { Star } from "~/interfaces/star";
import { StarParams } from "~/validators/stars";
import { MovieParamsSchema } from "~/validators/movies";
import { GenreParams } from "~/validators/genres";
import { Birthstone } from "next/font/google";
import { toast } from "sonner";
import { createMovie } from "~/api/movies";

export function CreateMovieCard() {
  const { data: allGenres, isPending } = useQuery({
    queryKey: ["genres"],
    queryFn: getGenres,
  });
  const [title, setTitle] = useState<string | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [year, setYear] = useState<number | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [director, setDirector] = useState<string | null>(null);
  const [birthYear, setBirthYear] = useState<number | null>(null);
  const [starName, setStarName] = useState<string | null>(null);
  const [genre, setGenre] = useState<GenreParams | null>(null);

  if (isPending) return <Loading />;

  const handleChangeStarName = (name: string) => {
      setStarName(name);
  };

  const handleChangeStarBirthYear = (birthYear: number) => {
    setBirthYear(birthYear);
  };

  const handleChangeGenre = (genre: GenreParams) => {
    setGenre(genre);
  };

  const handleSubmit = async () => {
    const result = MovieParamsSchema.safeParse({
      title: title,
      year: year,
      director: director,
      price: price,
      rating: rating,
      stars: [{name: starName, birthYear, id: null}],
      genres: [genre],
    });
    if (!result.success) {
      toast.error(`Error: ${fromError(result.error).toString().split(";")[0]}`);
      return;
    }

    const movieId = await createMovie(result.data).catch(console.error);
    if (!movieId) {
      return;
    }

    console.log(movieId);

    toast(`${title} (${year}) added!`);

    // print the errors maybe
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Create movie</CardTitle>
        <CardDescription>Add a new movie to our catalog.</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="The Terminator"
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="director">Director</Label>
              <Input
                id="director"
                placeholder="James Cameron"
                onChange={(e) => setDirector(e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="year">Release Year</Label>
              <Input
                id="year"
                placeholder="1984"
                type="number"
                onChange={(e) => setYear(parseInt(e.target.value))}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="framework">Genre</Label>
              <GenreDropdownInput
                genres={allGenres}
                onChangeGenre={handleChangeGenre}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Cast</Label>
              <div className="flex space-x-1">
                <Input
                  id="name"
                  placeholder="Arnold Schwarzenegger"
                  className="w-2/3"
                  onChange={(e) => {
                    handleChangeStarName(e.target.value);
                  }}
                />
                <Input
                  id="year"
                  type="number"
                  placeholder="1947"
                  className="w-1/3"
                  onChange={(e) => {
                    handleChangeStarBirthYear(parseInt(e.target.value));
                  }}
                />
              </div>
              <div className="flex flex-row space-x-1.5 mt-2">
                <div>
                  <Label htmlFor="year">Price (USD)</Label>
                  <Input
                    id="year"
                    placeholder="4.99"
                    type="number"
                    onChange={(e) => setPrice(parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="year">Rating</Label>
                  <Input
                    id="year"
                    placeholder="2.5"
                    type="number"
                    onChange={(e) => setRating(parseInt(e.target.value))}
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleSubmit}>Add</Button>
      </CardFooter>
    </Card>
  );
}

export default CreateMovieCard;
