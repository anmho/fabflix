"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "~/lib/utils";
import { Icons } from "~/components/icons";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu";

const categories: { title: string; href: string; description: string }[] = [
  {
    title: "Highest Rated Movies",
    href: "/search?sort-by=rating:desc",
    description: "Highest rated movies based on user reviews and ratings.",
  },
  {
    title: "Newest Movies",
    href: "/search?sort-by=year:desc",
    description: "Today's latest and greatest movies.",
  },
];

export function NavMenu() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Home
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Browse</NavigationMenuTrigger>
          <NavigationMenuContent>
            <BrowseMenuContent />
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
          <NavigationMenuContent>
            <CategoriesMenuContent />
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

function BrowseMenuContent() {
  return (
    <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr] ">
      <li className="row-span-3">
        <NavigationMenuLink asChild>
          <a
            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
            href="/browse"
          >
            <Icons.logo className="h-6 w-6" />
            <div className="mb-2 mt-4 text-lg font-medium">Browse</div>
            <p className="text-sm leading-tight text-muted-foreground">
              Browse through our collection of movies and TV shows.
            </p>
          </a>
        </NavigationMenuLink>
      </li>
      <ListItem href="/search?genre=action" title="Action">
        Exciting films filled with thrilling sequences and intense battles.
      </ListItem>
      <ListItem href="/search?genre=comedy" title="Comedy">
        Hilarious movies guaranteed to make you laugh out loud.
      </ListItem>
      <ListItem href="/search?genre=animation" title="Animation">
        Colorful and imaginative animated features for all ages.
      </ListItem>
    </ul>
  );
}

function CategoriesMenuContent() {
  return (
    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
      {categories.map((component) => (
        <ListItem
          key={component.title}
          title={component.title}
          href={component.href}
        >
          {component.description}
        </ListItem>
      ))}
    </ul>
  );
}
