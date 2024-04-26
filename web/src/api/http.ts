import { QueryClient } from '@tanstack/react-query';
import axios, { Axios, AxiosError } from "axios";

export const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

export const queryClient = new QueryClient();

// http.interceptors.response.use(undefined, errorHandler);

// function errorHandler(error: AxiosError) {
//   return Promise.reject(error);
// }
