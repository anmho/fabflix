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
import { handleLogin, isUserLoggedIn } from "~/api/login";
import { ErrorPage } from "~/components/error";
import { Loading } from "~/components/navigation/loading";
import { Cart } from "~/interfaces/cart";
import Login from "~/pages/login";

// login
// logout
// session
// cart
// updateCart

const updateCart = async () => {};

export interface Session {
  cart?: Cart;
  userType?: string | null; // Now can be 'string', 'undefined', or 'null'
}

export interface AuthContextValue {
  session: Session | null;
  login: (params: LoginParams) => Promise<LoginResponse>;
  logout: () => Promise<LoginResponse>;
}

const AuthContext = createContext<AuthContextValue>({
  session: null,
  login: (params: LoginParams) => Promise.reject(new Error("Not implemented")),
  logout: () => Promise.reject(new Error("Not implemented")),
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

  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    const checkUserType = async () => {
      const response = await isUserLoggedIn();
      if (response.isLoggedIn) {
        setUserType(response.userType);
      }
    };

    checkUserType();
  }, []);

  const handleLogin = async ({ email, password }: LoginParams) => {
    const response = await login({ email, password });
    if (response.success) {
      refetchCart();
      const userTypeResponse = await isUserLoggedIn();
      if (userTypeResponse.isLoggedIn) {
        setUserType(userTypeResponse.userType);
      }
    }
    return response;
  };

  const handleLogout = async () => {
    const response = await logout();
    refetchCart();
    setUserType(null);
    return response;
  };

  const session = cart ? { cart, userType } : null;
  const value = {
    session,
    login: handleLogin,
    logout: handleLogout,
  };

  if (isPending) {
    return <Loading />;
  }

  if (error !== null) {
    console.error(error);
    return <ErrorPage error={error} />;
  }

  return (
    <AuthContext.Provider
      value={{ session, login: handleLogin, logout: handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

const useAuth = () => {
  if (!useContext(AuthContext)) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return useContext(AuthContext);
};

export { AuthProvider, useAuth };
