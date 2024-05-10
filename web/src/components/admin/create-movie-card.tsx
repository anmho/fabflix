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
import { AxiosError } from "axios";

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
  const [starId, setStarId] = useState<string | null>(null);
  const [genre, setGenre] = useState<GenreParams | null>(null);

  if (isPending) return <Loading />;

  const handleChangeReleaseYear = (year: string) => {
    if (year === "" || year === undefined) {
      setYear(null);
      return;
    }
    setYear(parseInt(year));
  };

  const handleChangeStarId = (id: string) => {
    setStarId(id);
  };
  const handleChangeStarName = (name: string) => {
    setStarName(name ?? null);
  };

  const handleChangeStarBirthYear = (birthYear: string) => {
    if (birthYear === "" || birthYear === undefined) {
      setBirthYear(null);
      return;
    }
    setBirthYear(parseInt(birthYear));
  };
  const handleChangePrice = (price: string) => {
    if (price === "" || price === undefined) {
      setPrice(null);
      return;
    }
    setPrice(parseFloat(price));
  };

  const handleChangeGenre = (genre: GenreParams) => {
    setGenre(genre);
  };

  const handleChangeRating = (rating: string) => {
    if (rating === "" || rating === undefined) {
      setPrice(null);
      return;
    }
    setPrice(parseFloat(rating));
  };

  const handleSubmit = async () => {
    const data = {
      title: title,
      year: year,
      director: director,
      price: price,
      rating: rating,
      stars: [{ name: starName, birthYear, id: starId }],
      genres: [genre],
    };
    console.log(data);
    const result = MovieParamsSchema.safeParse(data);
    if (!result.success) {
      toast.error(`Error: ${fromError(result.error).toString().split(";")[0]}`);
      return;
    }

    const params = result.data;

    if (params.stars[0].id && params.stars[0].name) {
      toast.error("Error: only existing star or new star allowed.");
      return;
    }

    if (!params.stars[0].id && !params.stars[0].name) {
      toast.error("Error: must supply star id or name.");
      return;
    }

    // set the error message
    const res = await createMovie(result.data).catch((e) => {
      // refine
      let message = "Unknown error occurred";
      if (e instanceof AxiosError) {
        message = e.response?.data.message ?? message;
      }
      toast.error(`Error: ${message}`);
      return null;
    });
    if (!res || !res.id) {
      return;
    }

    const { id } = res;
    console.log(id);

    toast(`${title} (${year}) added with id ${id}!`);
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
            <div className="space-y-2">
              <Label>Cast</Label>
              <div>
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
                      handleChangeStarBirthYear(e.target.value);
                    }}
                  />
                </div>
                <div className="relative my-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or add existing star by ID
                    </span>
                  </div>
                </div>
                <Input
                  id="starId"
                  placeholder="nm0000216"
                  onChange={(e) => {
                    handleChangeStarId(e.target.value);
                  }}
                />
              </div>

              <div className="flex flex-row space-x-1.5 mt-2">
                <div>
                  <Label htmlFor="price">Price (USD)</Label>
                  <Input
                    id="price"
                    placeholder="4.99"
                    step={0.01}
                    type="number"
                    onChange={(e) => handleChangePrice(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="year">Rating</Label>
                  <Input
                    id="year"
                    placeholder="2.5"
                    step={0.1}
                    type="number"
                    onChange={(e) => handleChangeRating(e.target.value)}
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
