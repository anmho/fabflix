import { useEffect, useState } from "react";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { addStar, StarResponse } from "~/api/stars";
import { Badge } from "~/components/ui/badge";
import Link from "next/link";

const AddStarSegment: React.FC = () => {
  const [name, setName] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [feedback, setFeedback] = useState("");

  const [feedbackType, setFeedbackType] = useState<String | null>(null);
  const [addedStars, setAddedStars] = useState<StarResponse[]>([]);

  const handleAddStar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await addStar({
        name,
        birthYear: birthYear ? parseInt(birthYear) : undefined,
      });
      if (response.status && response.status !== 200) {
        setFeedback(response.message || "Failed to add star");
        setFeedbackType("error");
      } else {
        setFeedback("Star added successfully!");
        setAddedStars((previousStars) => [...previousStars, response]);
        setFeedbackType("success");
      }
    } catch (error: any) {
      setFeedback(error.toString());
      setFeedbackType("error");
    }
  };

  return (
    <>
      <div className="flex flex-wrap justify-start">
        {addedStars.length > 0 && (
          <>
            <h1>Added Stars: </h1>
            {addedStars.map((star) => (
              <Badge
                key={star.id}
                className="bg-background border-border text-foreground mr-1"
              >
                <Link href={`/stars/${star.id}`}>
                  {star.name}{" "}
                  {`(${
                    star.birthYear !== undefined && star?.birthYear > 0
                      ? star?.birthYear
                      : "N/A"
                  })`}{" "}
                  {star.numMovies}{" "}
                </Link>
              </Badge>
            ))}
          </>
        )}
      </div>
      <div className="flex flex-wrap justify-center mt-10">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Add Star</CardTitle>
            <CardDescription>
              Register a new star in the database.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddStar}>
              <div className="grid gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Star Name</Label>
                  <Input
                    id="name"
                    placeholder="Name of the star"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="birthYear">Birth Year (Optional)</Label>
                  <Input
                    id="birthYear"
                    placeholder="Year of birth"
                    value={birthYear}
                    onChange={(e) => setBirthYear(e.target.value)}
                    type="number"
                  />
                </div>

                {feedbackType !== null && (
                  <div
                    className={`${
                      feedbackType === "error"
                        ? "text-red-500"
                        : "text-green-500"
                    } text-sm mt-2`}
                  >
                    {feedback}
                  </div>
                )}
              </div>
              <CardFooter className="flex justify-between mt-5">
                <Button
                  variant="outline"
                  onClick={(e) => {
                    e.preventDefault();
                    setName("");
                    setBirthYear("");
                    setFeedback("");
                    setFeedbackType(null);
                  }}
                >
                  Reset
                </Button>
                <Button>Add Star</Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AddStarSegment;
