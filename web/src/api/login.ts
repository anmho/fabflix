// const API_URL = process.env.NEXT_PUBLIC_API_URL;

import { AxiosError } from "axios";
import { getApiClient } from "./http";

export interface LoginParams {
  email: string;
  password: string;
  recaptchaToken: string;
}

export const handleLogin = async (
  formData: URLSearchParams
): Promise<{ success: boolean; message?: string }> => {
  try {
    // const response = await fetch(`${API_URL}/login`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/x-www-form-urlencoded",
    //   },
    //   credentials: "include",
    //   body: formData,
    // });

    const api = getApiClient();

    try {
      const response = await api.post("/login", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      return { success: true };
    } catch (e: unknown) {
      console.error("Login error", e);

      if (e instanceof AxiosError) {
        return { success: false, message: e.response?.data };
      } else {
        return { success: false, message: e?.toString() ?? "unknown error" };
      }
    }
  } catch (error) {
    console.error("Failed to connect to the server.", error);
    return { success: false, message: "Failed to connect to the server." };
  }
};

export const isUserLoggedIn = async (): Promise<{
  isLoggedIn: boolean;
  userType: string | null;
  message?: string;
}> => {
  try {
    // const response = await fetch(`${API_URL}/isLoggedIn`, {
    //   method: "GET",
    //   credentials: "include",
    // });

    const api = await getApiClient();
    try {
      const response = await api.get("/isLoggedIn");
      const data = response.data;
      return { isLoggedIn: data.isLoggedIn, userType: data.userType };
    } catch (e) {
      console.error("Error checking login status", e);
      return {
        isLoggedIn: false,
        userType: null,
        message: "Failed to check login status",
      };
    }
  } catch (error) {
    console.error("Error checking login status", error);
    return {
      isLoggedIn: false,
      userType: null,
      message: "Failed to check login status",
    };
  }
};

export const employeeLogin = async ({
  email,
  password,
  recaptchaToken,
}: LoginParams): Promise<{
  success: boolean;
  message?: string;
  employeeData?: any;
}> => {
  const formData = new URLSearchParams();
  formData.append("email", email);
  formData.append("password", password);
  formData.append("g-recaptcha-response", recaptchaToken);

  // console.log(email, password, recaptchaToken);
  try {
    // const response = await fetch(`${API_URL}/employeeLogin`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/x-www-form-urlencoded",
    //   },
    //   credentials: "include",
    //   body: formData,
    // });

    try {
      const api = await getApiClient();
      const response = await api.post("/employeeLogin", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      const data = response.data;

      return {
        success: true,
        message: "Employee logged in successfully",
        employeeData: data,
      };
    } catch (e) {
      if (e instanceof AxiosError) {
        const data = await e.response?.data;
        console.error("Login error", data);
        return {
          success: false,
          message: data.message || "An error occurred during login.",
        };
      } else {
        console.error(e);
        return {
          success: false,
          message: "An error occurred during login.",
        };
      }
    }

    // const data = await response.json();

    // if (response.ok) {
    //   return {
    //     success: true,
    //     message: "Employee logged in successfully",
    //     employeeData: data,
    //   };
    // } else {
    //   console.error("Login error", data);
    //   return {
    //     success: false,
    //     message: data.message || "An error occurred during login.",
    //   };
    // }
  } catch (error) {
    console.error("Failed to connect to the server.", error);
    return {
      success: false,
      message: "Failed to connect to the server.",
    };
  }
};
