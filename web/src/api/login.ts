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

export const isUserLoggedIn = async (): Promise<{
  isLoggedIn: boolean;
  userType: string | null;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_URL}/isLoggedIn`, {
      method: "GET",
      credentials: "include",
    });
    if (response.ok) {
      const data = await response.json();
      return { isLoggedIn: data.isLoggedIn, userType: data.userType };
    } else {
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

export const employeeLogin = async (
  formData: URLSearchParams
): Promise<{ success: boolean; message?: string; employeeData?: any }> => {
  try {
    const response = await fetch(`${API_URL}/employeeLogin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      credentials: "include",
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: "Employee logged in successfully",
        employeeData: data,
      };
    } else {
      console.error("Login error", data);
      return {
        success: false,
        message: data.message || "An error occurred during login.",
      };
    }
  } catch (error) {
    console.error("Failed to connect to the server.", error);
    return {
      success: false,
      message: "Failed to connect to the server.",
    };
  }
};
