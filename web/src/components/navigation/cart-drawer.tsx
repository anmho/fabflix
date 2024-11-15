import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { MovieCartItem } from "~/components/cart/movie-item";
import { isUserLoggedIn } from "~/api/login";
import { fetchCart, addMovieToCart } from "~/api/cart";
import { Movie } from "~/interfaces/movie";
import { useTheme } from "next-themes";
import { cn } from "~/lib/utils";
import { Loading } from "./loading";

export function CartDrawer() {
  const [isLoading, setIsLoading] = useState<Boolean>(true);
  const [cartItems, setCartItems] = useState<Movie[]>([]);
  const [showDrawer, setShowDrawer] = useState<boolean>(true);
  const router = useRouter();
  const { theme } = useTheme();

  useEffect(() => {
    const checkUserAndRoute = async () => {
      const { isLoggedIn } = await isUserLoggedIn();
      if (isLoggedIn && router.pathname !== "/checkout") {
        setShowDrawer(true);
        getCartItems();
      } else {
        setShowDrawer(false);
      }
    };

    checkUserAndRoute();
  }, [router.pathname]);

  const getCartItems = async () => {
    await fetchCart()
      .then((cart) => cart.movies)
      .then((movies) => {
        // console.log(movies);
        setCartItems(movies);
        setIsLoading(false);
      });
  };

  const updateMovies = () => {
    getCartItems();
  };

  if (!showDrawer) return <></>;

  // console.log("cartItems", cartItems);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          onClick={getCartItems}
          className={cn(
            theme,
            "bg-primary text-primary-foreground hover:bg-primary/90 border-none"
          )}
        >
          Shopping Cart
        </Button>
      </SheetTrigger>
      <SheetContent
        className={cn(theme, "bg-background text-foreground border-border")}
      >
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
          {cartItems.length > 0 && (
            <SheetClose asChild>
              <Button
                variant="outline"
                onClick={() => {
                  router.push("/checkout");
                }}
              >
                Proceed to payment
              </Button>
            </SheetClose>
          )}
        </SheetHeader>
        {isLoading ? (
          <Loading />
        ) : (
          <div className="flex flex-wrap justify-around items-start">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <React.Fragment key={item.id}>
                  <MovieCartItem
                    movie={item}
                    isCartPage={true}
                    handleAddToCart={() =>
                      addMovieToCart(item.id, updateMovies)
                    }
                    updateMovies={updateMovies}
                  />
                </React.Fragment>
              ))
            ) : (
              <div className="mt-5 font-semibold text-[20px]">
                Your shopping cart is empty
              </div>
            )}
          </div>
        )}
        {cartItems.length > 0 && (
          <SheetFooter>
            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
            <SheetClose asChild>
              <Button
                variant="outline"
                onClick={() => {
                  router.push("/checkout");
                }}
              >
                Proceed to payment
              </Button>
            </SheetClose>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
