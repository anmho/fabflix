"use client";
import React, { useState } from "react";

import { NavMenu } from "./navigation-menu";
import { CartDrawer } from "./cart-drawer";
export function NavigationBar() {
  return (
    <div className="flex justify-center items-center p-4">
      <NavMenu />
      <CartDrawer />
    </div>
  );
}
