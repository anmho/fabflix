"use client";
import React, { useState } from "react";
import {
  HoveredLink,
  Menu,
  MenuItem,
  ProductItem,
} from "../components/ui/navbar-menu";
import { cn } from "../utils/cn";
import top20MoviesImage from "../images/top20MoviesPageSS.png";
import homePageImage from "../images/homePageSS.png";
export function Navbar() {
  return (
    <div className="relative w-full flex items-center justify-center">
      <NavbarWrapper className="top-2" />
    </div>
  );
}

function NavbarWrapper({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  return (
    <div
      className={cn("fixed top-10 inset-x-0 max-w-2xl mx-auto z-50", className)}
    >
      <Menu setActive={setActive}>
        <MenuItem setActive={setActive} active={active} item="Home">
          <div className="text-sm grid grid-cols-2 gap-10 p-4">
            <ProductItem
              title="Home"
              href="/"
              src={homePageImage.src}
              description=""
            />
          </div>
        </MenuItem>
        <MenuItem setActive={setActive} active={active} item="Top Movies">
          <div className="text-sm grid grid-cols-2 gap-10 p-4">
            <ProductItem
              title="Top 20 Movies"
              href="/movies"
              src={top20MoviesImage.src}
              description="Discover the highest ranked top 20 movies."
            />
          </div>
          <div className="text-sm grid grid-cols-2 gap-10 p-4">
            <ProductItem
              title="Shopping Cart"
              href="/cart"
              src={top20MoviesImage.src}
              description="See your shopping cart."
            />
          </div>
        </MenuItem>
      </Menu>
    </div>
  );
}
