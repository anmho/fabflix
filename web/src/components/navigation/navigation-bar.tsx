"use client";
import React, { useState } from "react";

import { NavMenu } from "./navigation-menu";
import { CartDrawer } from "./cart-drawer";
import { LogoutButton } from "../auth/logout-button";
import { useAuth } from "~/hooks/AuthProvider";
export function NavigationBar() {
  const { logout, session } = useAuth();
  return (
    <div className="flex justify-center items-center p-4 border-border text-foreground backdrop-blur-sm dark bg-background">
      <NavMenu />
      {session && <CartDrawer />}
      {session && <LogoutButton logout={logout} />}
    </div>
  );
}
