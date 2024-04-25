interface CheckoutData {
  creditCardId: string;
  firstName: string;
  lastName: string;
  expirationDate: string;
}
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const handleCheckout = async (data: CheckoutData) => {
  const formData = new URLSearchParams();
  formData.append("creditCardId", data.creditCardId);
  formData.append("firstName", data.firstName);
  formData.append("lastName", data.lastName);
  formData.append("expirationDate", data.expirationDate);

  try {
    const response = await fetch(`${API_URL}/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
      credentials: "include",
    });
    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        status: data.status,
        message: data.message,
      };
    }
    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error("Failed to fetch:", error);
    return {
      success: false,
      status: 500,
      message: `Failed to fetch: ${error}`,
    };
  }
};
