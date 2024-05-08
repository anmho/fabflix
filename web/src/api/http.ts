import { QueryClient } from "@tanstack/react-query";
import axios, { Axios, AxiosError } from "axios";

export const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

export const queryClient = new QueryClient();

http.interceptors.response.use(undefined, errorHandler);

const allowedPaths = new Set(["/", "/login", "/employeeLogin", "/_dashboard"]);

function errorHandler(error: AxiosError) {
  const url = new URL(window.location.href);

  if (error.response?.status === 401 && !allowedPaths.has(url.pathname)) {
    window.location.href = "/login";
  }

  return Promise.reject(error);
}
