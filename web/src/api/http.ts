import { QueryClient } from "@tanstack/react-query";
import axios, { Axios, AxiosError } from "axios";

const getBaseUrl = () => {
  const url = new URL(window.location.href);
  if (url.origin === "https://gcp.usefabflix.com") {
    return "https://gcp.api.usefabflix.com/api";
    // process.env.NEXT_PUBLIC_API_URL
  } else if (url.origin === "https://usefabflix.com") {
    return "https://api.usefabflix.com";
  } else {
    return "http://localhost:8080/api";
  }
};

export const getApiClient = () => {
  const http = axios.create({
    baseURL: getBaseUrl(),
    withCredentials: true,
  });

  http.interceptors.response.use(undefined, errorHandler);
  return http;
};

export const http = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
});

http.interceptors.response.use(undefined, errorHandler);

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
