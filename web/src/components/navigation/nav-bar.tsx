"use client";
import React, { useState } from "react";

import { NavMenu } from "./nav-menu";
import { CartDrawer } from "./cart-drawer";
import { LogoutButton } from "../auth/logout-button";
import { useAuth } from "~/hooks/AuthProvider";
import { ThemeToggle } from "./theme-toggle";
import { useTheme } from "next-themes";
import { cn } from "~/lib/utils";
export function NavBar() {
  const { session } = useAuth();
  const { theme } = useTheme();
  return (
    <div
      className={cn(
        theme,
        " flex flex-wrap justify-center items-center p-4 border-border text-foreground backdrop-blur-sm bg-background"
      )}
    >
      <NavMenu />
      {session && <CartDrawer />}
      {session && <LogoutButton />}
      <ThemeToggle />
    </div>
  );
}
