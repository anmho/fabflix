"use client";

import * as React from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Genre } from "~/interfaces/genre";
import { GenreParams } from "~/validators/genres";

interface GenreDropDownInputProps {
  genres: Genre[];
  onChangeGenre: (genre: GenreParams) => void;
}

export function GenreDropdownInput({
  genres,
  onChangeGenre,
}: GenreDropDownInputProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  const handleChangeGenre = (genreName: string) => {
    setValue(genreName);
    setOpen(false);
    const genre = {
      id: genres.find((g) => g.name === genreName)?.id.toString() ?? undefined,
      name: genreName,
    };
    onChangeGenre(genre);
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value ? value : "Add genre"}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            placeholder="Search framework..."
            className="h-9"
            onValueChange={setValue}
          />
          <CommandEmpty className="p-1">
            <Button
              variant="ghost"
              className="w-full m-0 justify-left"
              onClick={() => handleChangeGenre(value)}
            >
              Create Genre
            </Button>
          </CommandEmpty>
          <CommandList>
            <CommandGroup>
              {genres.map((genre) => (
                <CommandItem
                  key={genre.id}
                  value={genre.name}
                  onSelect={handleChangeGenre}
                >
                  {genre.name}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === genre.name ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
