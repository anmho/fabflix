// services/api.ts
import { http } from "./http";
import { Cart } from "~/interfaces/cart";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// gets the cart for the current user
export const fetchCart = async (): Promise<Cart> => {
  const response = await http.get("/cart").catch((e) => {
    if (e.response.status === 401) {
      return { data: null };
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
    const response = await fetch(`${API_URL}/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "add",
        movieId: movieId,
      }),
      credentials: "include",
    });
    // if (response.status === 401) {
    //   window.location.href = "/login";
    // }
    const data = await response.json();
    // console.log("Add to Cart Response:", data);
    updateMovies(); // Update parent component's movie list
  } catch (error) {
    console.error("Error adding to cart:", error);
  }
};

export const handleEditFromCart = async (
  movieId: string,
  quantity: number, // deletes item if quantity <= 0 else it sets quantity to quantity
  updateMovies: () => void
) => {
  try {
    const response = await fetch(`${API_URL}/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "edit",
        movieId: movieId,
        quantity: quantity,
      }),
      credentials: "include",
    });
    // if (response.status === 401) {
    //   window.location.href = "/login";
    // }
    const data = await response.json();
    // console.log("Delete Response:", data);
    updateMovies(); // Update parent component's movie list
  } catch (error) {
    console.error("Error deleting movie:", error);
  }
};
