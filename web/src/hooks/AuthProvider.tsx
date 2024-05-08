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
import { employeeLogin, handleLogin, isUserLoggedIn } from "~/api/login";
import { ErrorPage } from "~/components/error";
import { Loading } from "~/components/navigation/loading";
import { Cart } from "~/interfaces/cart";
import Login from "~/pages/login";

export interface Session {
  cart?: Cart;
  userType?: string | null;
}

export interface AuthContextValue {
  session: Session | null;
  login: (params: LoginParams) => Promise<LoginResponse>;
  logout: () => Promise<LoginResponse>;
  handleEmployeeLogin: (
    params: LoginParams
  ) => Promise<{ success: boolean; message?: string; employeeData?: any }>;
}

const AuthContext = createContext<AuthContextValue>({
  session: null,
  login: (params: LoginParams) => Promise.reject(new Error("Not implemented")),
  logout: () => Promise.reject(new Error("Not implemented")),
  handleEmployeeLogin: (params: LoginParams) =>
    Promise.reject(new Error("Not implemented")),
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
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

  const handleLogin = async ({
    email,
    password,
    recaptchaToken,
  }: LoginParams) => {
    const response = await login({ email, password, recaptchaToken });
    if (response.success) {
      refetchCart();
      const userTypeResponse = await isUserLoggedIn();
      if (userTypeResponse.isLoggedIn) {
        setUserType(userTypeResponse.userType);
      }
    }
    return response;
  };

  const handleEmployeeLogin = async ({
    email,
    password,
    recaptchaToken,
  }: LoginParams) => {
    console.log("auth", email, password, recaptchaToken);
    const response = await employeeLogin({ email, password, recaptchaToken });
    if (response.success) {
      refetchCart();
      const userTypeResponse = await isUserLoggedIn();
      if (
        userTypeResponse.isLoggedIn &&
        userTypeResponse.userType === "employee"
      ) {
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
    handleEmployeeLogin,
  };

  if (isPending) {
    return <Loading />;
  }

  if (error !== null) {
    console.error(error);
    return <ErrorPage error={error} />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
