import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";
import { login, LoginParams, LoginResponse, logout } from "~/api/auth";
import { fetchCart } from "~/api/cart";
import { handleLogin } from "~/api/login";
import { ErrorPage } from "~/components/error";
import { Loading } from "~/components/navigation/loading";
import { Cart } from "~/interfaces/cart";
import AuthPage from "~/pages/auth";
import Login from "~/pages/login";

// login
// logout
// session
// cart
// updateCart

const updateCart = async () => {};

export interface Session {
  cart: Cart;
  // recentMovieSearch: string;
  // updateCart: () => void;
}

export interface AuthContextValue {
  session: Session | null;
  login: ((params: LoginParams) => Promise<LoginResponse>) | null;
  logout: (() => Promise<LoginResponse>) | null;
}

const AuthContext = createContext<AuthContextValue>({
  session: null,
  login: null,
  logout: null,
});

interface AuthProviderProps {
  children: React.ReactNode;
}
function AuthProvider({ children }: AuthProviderProps) {
  const {
    isPending,
    error,
    data: cart,
    refetch: refetchCart,
  } = useQuery({
    queryKey: ["cart"],
    queryFn: fetchCart,
    retry: false,
  });

  if (isPending) {
    return <Loading />;
  }

  if (error !== null) {
    console.error(error);
    return <ErrorPage error={error} />;
  }

  const handleLogin = async ({ email, password }: LoginParams) => {
    const response = await login({ email, password });
    refetchCart();
    return response;
  };

  const handleLogout = async () => {
    const response = await logout();
    refetchCart();
    console.log("AuthProvider", response);
    return response;
  };

  const session = cart ? { cart } : null;
  const value = {
    session,
    login: handleLogin,
    logout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

const useAuth = () => {
  if (!useContext(AuthContext)) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return useContext(AuthContext);
};

export { AuthProvider, useAuth };
