import { QueryClient } from "@tanstack/react-query";
import axios, { AxiosError, AxiosInstance } from "axios";

const getBaseUrl = () => {
  const url = new URL(window.location.href);
  if (url.origin === "https://gcp.usefabflix.com") {
    return "https://gcp.api.usefabflix.com/api";
  } else if (url.origin === "https://usefabflix.com") {
    return "https://api.usefabflix.com/api";
  } else {
    return "http://localhost:8080/api";
  }
};

const createApiClient = (baseUrl: string): AxiosInstance => {
  const http = axios.create({
    baseURL: baseUrl,
    withCredentials: true,
  });

  http.interceptors.response.use(undefined, errorHandler);
  return http;
};

const gcpApiClient = createApiClient("https://gcp.api.usefabflix.com/api");
const awsApiClient = createApiClient("https://api.usefabflix.com/api");
const devApiClient = createApiClient("http://localhost:8080/api");
export const getApiClient = (): AxiosInstance => {
  const url = new URL(window.location.href);
  let client: AxiosInstance;
  if (url.origin === "https://gcp.usefabflix.com") {
    // return "https://gcp.api.usefabflix.com/api";
    client = gcpApiClient;
  } else if (
    url.origin === "https://usefabflix.com" ||
    url.origin === "http://13.52.113.32:3000" ||
    url.origin === "http://13.57.128.187:3000"
  ) {
    // return "https://api.usefabflix.com/api";
    client = awsApiClient;
  } else {
    // return "http://localhost:8080/api";
    client = devApiClient;
  }

  return client;
};

// export const http = axios.create({
//   baseURL: getBaseUrl(),
//   withCredentials: true,
// });

// http.interceptors.response.use(undefined, errorHandler);

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
