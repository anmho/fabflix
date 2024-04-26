import { useRouter } from "next/router";
import { useAuth } from "~/hooks/auth";
import { Loading } from "~/components/navigation/loading";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const handleLogin = async (
  formData: URLSearchParams
): Promise<{ success: boolean; message?: string }> => {
  

  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      credentials: "include",
      body: formData,
    });

    if (response.ok) {
      return { success: true };
    } else {
      const error = await response.json();
      console.error("Login error", error);
      return { success: false, message: error.message };
    }
  } catch (error) {
    console.error("Failed to connect to the server.", error);
    return { success: false, message: "Failed to connect to the server." };
  }
};

export const isLoggedIn = async (): Promise<{
  success: boolean;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_URL}/isLoggedIn`, {
      method: "GET",
      credentials: "include",
    });
    if (response.ok) {
      const data = await response.json();
      return { success: data };
    } else {
      return { success: false, message: "Failed to check login status" };
    }
  } catch (error) {
    console.error("Error checking login status", error);
    return { success: false, message: "Failed to connect to the server." };
  }
};
