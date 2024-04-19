// services/api.ts
import { Movie } from "~/interfaces/movie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchCartItems = async (): Promise<Movie[]> => {
  try {
    const response = await fetch(`${API_URL}/cart`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (response.status === 401) {
      console.log('window.location.href = "/login";');
      window.location.href = "/login";
    }
    if (!response.ok) {
      throw new Error("Failed to fetch cart items");
    }
    const cartItems: Movie[] = await response.json();
    console.log("Cart Items Fetched:", cartItems);
    return cartItems;
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return [];
  }
};

export const handleAddToCart = async (
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
    if (response.status === 401) {
      console.log('window.location.href = "/login";');
      window.location.href = "/login";
    }
    const data = await response.json();
    console.log("Add to Cart Response:", data);
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
    if (response.status === 401) {
      console.log('window.location.href = "/login";');
      window.location.href = "/login";
    }
    const data = await response.json();
    console.log("Delete Response:", data);
    updateMovies(); // Update parent component's movie list
  } catch (error) {
    console.error("Error deleting movie:", error);
  }
};
