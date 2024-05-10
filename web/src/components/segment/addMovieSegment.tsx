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
    <main className="max-w-[1440px] flex items-center justify-center">
      <CreateMovieCard />
    </main>
  );
};

export default AddMovieSegment;
