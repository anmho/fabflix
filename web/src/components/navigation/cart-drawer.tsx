import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/router";
import MovieCard from "~/components/MovieCard";
import { isLoggedIn } from "~/services/login";
import { fetchCartItems, handleAddToCart } from "~/services/carts";
import { Movie } from "~/interfaces/movie";

export function CartDrawer() {
  const [isLoading, setIsLoading] = useState<Boolean>(true);
  const [cartItems, setCartItems] = useState<Movie[]>([]);
  const [showDrawer, setShowDrawer] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    isLoggedIn().then(({ success }) => {
      setShowDrawer(success);
    });
  }, [router]);

  const getCartItems = async () => {
    await fetchCartItems().then((items) => {
      setCartItems(items);
      setIsLoading(false);
    });
  };

  const updateMovies = () => {
    getCartItems();
  };

  if (!showDrawer) return;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" onClick={getCartItems}>
          Shopping Cart
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
          {cartItems.length > 0 && (
            <Button
              variant="outline"
              onClick={() => alert("Proceed to payment not implemented yet")}
            >
              Proceed to payment
            </Button>
          )}
        </SheetHeader>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="flex flex-wrap justify-around items-start">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <React.Fragment key={item.id}>
                  <MovieCard
                    movie={item}
                    isCartPage={true}
                    handleAddToCart={() =>
                      handleAddToCart(item.id, updateMovies)
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
