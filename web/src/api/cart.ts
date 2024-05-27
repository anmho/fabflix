// services/api.ts
import { AxiosError } from "axios";
import { getApiClient } from "./http";
import { Cart } from "~/interfaces/cart";

// gets the cart for the current user
export const fetchCart = async (): Promise<Cart> => {
  const http = getApiClient();

  const response = await http.get("/cart").catch((e: unknown) => {
    if (e instanceof AxiosError) {
      if (e.response?.status === 401) {
        return { data: null };
      }
    }

    throw e;
  });
  const cart = response.data;
  // console.log("Cart Fetched:", cart);
  return cart;
};

// export const updateCart = async (cart: Cart): Promise<Cart> => {};

export const addMovieToCart = async (
  movieId: string,
  updateMovies: () => void
) => {
  try {
    const api = getApiClient();
    const response = await api.post("/cart", {
      action: "add",
      movieId: movieId,
    });
    // await fetch(`${API_URL}/cart`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     action: "add",
    //     movieId: movieId,
    //   }),
    //   credentials: "include",
    // });
    // if (response.status === 401) {
    //   window.location.href = "/login";
    // }
    // const data = await response.json();
    const data = response.data;
    // console.log("Add to Cart Response:", data);
    updateMovies(); // Update parent component's movie list
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        window.localStorage.href = "/login";
      }
    }
    console.error("Error adding to cart:", error);
  }
};

export const handleEditFromCart = async (
  movieId: string,
  quantity: number, // deletes item if quantity <= 0 else it sets quantity to quantity
  updateMovies: () => void
) => {
  try {
    const api = getApiClient();
    const response = await api.post("/cart", {
      action: "edit",
      movieId: movieId,
      quantity: quantity,
    });
    // const response = await fetch(`${API_URL}/cart`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     action: "edit",
    //     movieId: movieId,
    //     quantity: quantity,
    //   }),
    //   credentials: "include",
    // });
    // if (response.status === 401) {
    //   window.location.href = "/login";
    // }
    const data = await response.data;
    console.log("Delete Response:", data);
    updateMovies(); // Update parent component's movie list
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        window.localStorage.href = "/login";
      }
    } else {
      console.error("Error deleting movie:", error);
    }
  }
};
