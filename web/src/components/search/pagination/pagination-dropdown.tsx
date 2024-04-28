"use client";

import { CaretSortIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
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
import { cn } from "~/lib/utils";

interface PaginationDropdownProps {
  className?: string;
  initLimit: number;
  changeLimitParam: (limit: number) => void;
}

export function PaginationDropdown({
  className,
  initLimit,
  changeLimitParam,
}: PaginationDropdownProps) {
  const [limit, setLimit] = React.useState<number>(initLimit ?? 25);
  const { theme } = useTheme();

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
        <Button
          variant="outline"
          className="bg-background text-foreground border-border"
        >
          {limit}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={cn(
          theme,
          "bg-background text-popover-foreground border-border"
        )}
      >
        <DropdownMenuLabel>Per Page</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={limit.toString()}
          onValueChange={handleOnValueChange}
        >
          <DropdownMenuRadioItem value={"10"} onSelect={handleOnSelect}>
            10
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value={"25"}
            onSelect={handleOnSelect}
            defaultChecked={true}
          >
            25
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value={"50"} onSelect={handleOnSelect}>
            50
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value={"100"} onSelect={handleOnSelect}>
            100
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
