import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "~/components/ui/button";
import CreateMovieCard from "~/components/admin/create-movie-card";

const AddMovieSegment: React.FC = () => {
  return (
    <>
      <div>AddMovieSegment</div>
      <CreateMovieCard />
    </>
  );
};

export default AddMovieSegment;
