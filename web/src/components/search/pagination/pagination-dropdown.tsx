"use client";

import { CaretSortIcon } from "@radix-ui/react-icons";
import * as React from "react";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

interface PaginationDropdownProps {
  className?: string;
  changeLimitParam: (limit: number) => void;
}

export function PaginationDropdown({
  className,
  changeLimitParam,
}: PaginationDropdownProps) {
  const [limit, setLimit] = React.useState(25);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      changeLimitParam(limit);
    }
  };

  const handleOnValueChange = (value: string) => {
    setLimit(parseInt(value));
  };

  const handleOnSelect = (e: Event) => {
    // e.preventDefault();
  };
  return (
    <DropdownMenu onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild className={className}>
        <Button variant="outline">
          {limit}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Per Page</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={limit.toString()}
          onValueChange={handleOnValueChange}
        >
          <DropdownMenuRadioItem value={"10"} onSelect={handleOnSelect}>
            10
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value={"25"} onSelect={handleOnSelect}>
            25
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value={"50"} onSelect={handleOnSelect}>
            50
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
