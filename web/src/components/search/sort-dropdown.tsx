"use client";

import * as React from "react";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { ArrowDownWideNarrow } from "lucide-react";

type Checked = DropdownMenuCheckboxItemProps["checked"];

export function SortDropdown() {
  const [showStatusBar, setShowStatusBar] = React.useState<Checked>(true);
  const [showActivityBar, setShowActivityBar] = React.useState<Checked>(false);
  const [showPanel, setShowPanel] = React.useState<Checked>(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex justify-center items-center">
          <ArrowDownWideNarrow className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={showStatusBar}
          onSelect={(e) => e.preventDefault()}
          onCheckedChange={setShowStatusBar}
        >
          Rating (highest first)
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={showStatusBar}
          onSelect={(e) => e.preventDefault()}
          onCheckedChange={setShowStatusBar}
        >
          Rating (lowest first)
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={showActivityBar}
          onSelect={(e) => e.preventDefault()}
          onCheckedChange={setShowActivityBar}
        >
          Title (A to Z)
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={showActivityBar}
          onSelect={(e) => e.preventDefault()}
          onCheckedChange={setShowActivityBar}
        >
          Title (Z to A)
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={showPanel}
          onSelect={(e) => e.preventDefault()}
          onCheckedChange={setShowPanel}
        >
          Release Year (newest first)
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={showPanel}
          onSelect={(e) => e.preventDefault()}
          onCheckedChange={setShowPanel}
        >
          Release Year (oldest first)
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
