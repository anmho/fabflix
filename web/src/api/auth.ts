import { http } from "./http";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function logout(): Promise<{ success: boolean; message: string }> {
  const response = await http.post("/logout");

  return response.data;
}

export interface LoginParams {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}

export const login = async ({
  email,
  password,
}: LoginParams): Promise<LoginResponse> => {
  try {
    const formData = new URLSearchParams();
    formData.append("email", email);
    formData.append("password", password);
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