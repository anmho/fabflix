import { createContext, useContext, useState } from "react";
import { Cart } from "~/interfaces/cart";

// login
// logout
// session
// cart
// updateCart

const updateCart = async () => {};

export interface Session {
  cart: Cart;
  recentMovieSearch: string;
  updateCart: () => void;
}

export interface AuthContextValue {
  session: Session | null;
  login: (() => void) | undefined;
  logout: (() => void) | undefined;
}

const AuthContext = createContext<AuthContextValue>({
  session: null,
  login: undefined,
  logout: undefined,
});

function AuthProvider({ children }: any) {
  const [session, setSession] = useState<Session | null>(null);

  const login = async () => {
    console.log("logging in");
  };
  const logout = async () => {
    console.log("logging out");
  };

  const value = {
    session: null,
    login,
    logout,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

const useAuth = useContext(AuthContext);

AuthContext;

export { AuthProvider, useAuth };
