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
import { fetchCart } from "~/api/cart";
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
  // login: (() => void) | undefined;
  // logout: (() => void) | undefined;
}

const AuthContext = createContext<AuthContextValue>({
  session: null,
  // login: undefined,
  // logout: undefined,
});

interface AuthProviderProps {
  children: React.ReactNode;
}
function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const {
    isPending,
    error,
    data: cart,
  } = useQuery({
    queryKey: ["cart"],
    queryFn: fetchCart,
    retry: false,
  });

  if (isPending) {
    return <Loading />;
  }

  if (error !== null) {
    console.log(error);
    return <ErrorPage error={error} />;
  }

  const session = cart ? { cart } : null;
  const value = {
    session,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
