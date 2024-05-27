import { AxiosError } from "axios";
import { getApiClient } from "./http";

interface CheckoutData {
  creditCardId: string;
  firstName: string;
  lastName: string;
  expirationDate: string;
}

export const handleCheckout = async (data: CheckoutData) => {
  const formData = new URLSearchParams();
  formData.append("creditCardId", data.creditCardId);
  formData.append("firstName", data.firstName);
  formData.append("lastName", data.lastName);
  formData.append("expirationDate", data.expirationDate);

  try {
    const api = getApiClient();
    const response = await api.post("/checkout", formData, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    // fetch(`${API_URL}/checkout`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/x-www-form-urlencoded",
    //   },
    //   body: formData.toString(),
    //   credentials: "include",
    // });
    // const data = await response.json();
    const data = response.data;

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error("Failed to fetch:", error);
    if (error instanceof AxiosError) {
      const data = error.response?.data;
      return {
        success: false,
        status: data.status,
        message: data.message,
      };
    }
    return {
      success: false,
      status: 500,
      message: `Failed to fetch: ${error}`,
    };
  }
};
