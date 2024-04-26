import axios, { Axios, AxiosError } from "axios";

export const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// http.interceptors.response.use(undefined, errorHandler);

// function errorHandler(error: AxiosError) {
//   return Promise.reject(error);
// }
