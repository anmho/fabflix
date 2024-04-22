"use client";
import React, { useState } from "react";

import { cn } from "../../utils/cn";
import homePageImage from "../images/homePageSS.png";
import { NavMenu } from "./navigation-menu";
import { Menu, MenuItem, ProductItem } from "../ui/navbar-menu";
import { CartDrawer } from "./cart-drawer";
import { BentoGridDemo } from "../bento-grid";
export function NavigationBar() {
  return (
    // <div className="w-full flex items-center justify-center bg-red-500 h-10">
    // {/* <NavbarWrapper className="top-2" /> */}

    // {/* </div> */}
    <div className="flex justify-center items-center p-4">
      <NavMenu />
      <CartDrawer />
    </div>
  );
}

// function NavbarWrapper({ className }: { className?: string }) {
//   const [active, setActive] = useState<string | null>(null);
//   return (
//     <div
//       className={cn("fixed top-10 inset-x-0 max-w-2xl mx-auto z-50", className)}
//     >
//       <Menu setActive={setActive}>
//         <MenuItem setActive={setActive} active={active} item="Home">
//           <div className="text-sm grid grid-cols-2 gap-10 p-4">
//             <ProductItem
//               title="Home"
//               href="/"
//               src={homePageImage.src}
//               description=""
//             />
//           </div>
//         </MenuItem>
//         <MenuItem setActive={setActive} active={active} item="Top Movies">
//           <div className="text-sm grid grid-cols-2 gap-10 p-4">
//             <ProductItem
//               title="Top 20 Movies"
//               href="/movies"
//               src={top20MoviesImage.src}
//               description="Discover the highest ranked top 20 movies."
//             />
//           </div>
//           <div className="text-sm grid grid-cols-2 gap-10 p-4">
//             <ProductItem
//               title="Shopping Cart"
//               href="/cart"
//               src={top20MoviesImage.src}
//               description="See your shopping cart."
//             />
//           </div>
//         </MenuItem>
//       </Menu>
//     </div>
//   );
// }
