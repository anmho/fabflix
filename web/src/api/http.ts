import { QueryClient } from "@tanstack/react-query";
import axios, { AxiosError, AxiosInstance } from "axios";
import { env } from "~/utils/env";

const createApiClient = (baseUrl: string): AxiosInstance => {
  const http = axios.create({
    baseURL: baseUrl,
    withCredentials: true,
  });

  http.interceptors.response.use(undefined, errorHandler);
  return http;
};
const client = createApiClient(env.NEXT_PUBLIC_API_URL);
export const getApiClient = (): AxiosInstance => {
  console.log(process.env.NEXT_PUBLIC_API_URL);

  return client;
};

export const queryClient = new QueryClient();

const allowedPaths = new Set(["/", "/login", "/employeeLogin", "/_dashboard"]);

function errorHandler(error: AxiosError) {
  const url = new URL(window.location.href);
  if (error.response?.status === 401 && !allowedPaths.has(url.pathname)) {
    console.error("should redirect", error);
    window.location.href = "/login";
  }

  return Promise.reject(error);
}
