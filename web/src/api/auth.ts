import { AxiosError } from "axios";
import { getApiClient } from "./http";

export async function logout(): Promise<{ success: boolean; message: string }> {
  const http = getApiClient();
  const response = await http.post("/logout");

  return response.data;
}

export interface LoginParams {
  email: string;
  password: string;
  recaptchaToken: string;
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
  recaptchaToken,
}: LoginParams): Promise<LoginResponse> => {
  try {
    const formData = new URLSearchParams();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("g-recaptcha-response", recaptchaToken);
    // const response = await fetch(`${API_URL}/login`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/x-www-form-urlencoded",
    //   },
    //   credentials: "include",
    //   body: formData,
    // });
    const api = getApiClient();
    const response = api.post("/login", formData, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    console.log(response);

    return { success: true };
  } catch (e) {
    if (e instanceof AxiosError) {
      const error = e.response?.data;
      console.error("Login error", error);
      return { success: false, message: error.message };
    } else {
      console.error("Failed to connect to the server.", e);
      return { success: false, message: "Failed to connect to the server." };
    }
  }
};

export const isUserLoggedIn = async (): Promise<{
  isLoggedIn: boolean;
  userType: string | null;
  message?: string;
}> => {
  try {
    const api = getApiClient();
    const response = await api.get("/isLoggedIn");
    const data = await response.data;
    return { isLoggedIn: data.isLoggedIn, userType: data.userType };
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        isLoggedIn: false,
        userType: null,
        message: "Failed to check login status",
      };
    }
    console.error("Error checking login status", error);
    return {
      isLoggedIn: false,
      userType: null,
      message: "Failed to check login status",
    };
  }
};
