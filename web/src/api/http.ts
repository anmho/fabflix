import { QueryClient } from "@tanstack/react-query";
import axios, { AxiosError, AxiosInstance } from "axios";

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
const instance1ApiClient = createApiClient("http://13.52.113.32:8080/api");
const instance2ApiClient = createApiClient("http://13.57.128.187:8080/api");
const devApiClient = createApiClient("http://localhost:8080/api");
export const getApiClient = (): AxiosInstance => {
  const url = new URL(window.location.href);
  let client: AxiosInstance;
  if (url.origin.startsWith("https://gcp.usefabflix.com")) {
    client = gcpApiClient;
  } else if (url.origin.startsWith("https://usefabflix.com")) {
    // return "https://api.usefabflix.com/api";
    client = awsApiClient;
  } else if (url.origin.startsWith("http://13.52.113.32:3000")) {
    // return "http://localhost:8080/api";
    client = instance1ApiClient;
  } else if (url.origin.startsWith("http://13.57.128.187:3000")) {
    client = instance2ApiClient;
  } else {
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
