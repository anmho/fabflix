import axios, { Axios, AxiosError } from "axios";

export const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

http.interceptors.response.use(undefined, errorHandler);

function errorHandler(error: AxiosError) {
  const statusCode = error.response?.status;
  if (statusCode === axios.HttpStatusCode.Unauthorized) {
    window.location.href = "/login";
  } else {
    console.error("Error fetching:", error);
  }

  return Promise.reject(error);
}
