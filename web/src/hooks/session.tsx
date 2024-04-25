import { createContext, useContext } from "react";
import { Cart } from "~/interfaces/cart";

export interface Session {
  cart: Cart;
}

export interface AuthContextValue {
  session: Session | null;
  // isPending: boolean;
  // signOut: () => Promise<{
  //   error: AuthError | null;
  // }>;
}

const AuthContext = createContext<AuthContextValue>({
  session: null,
  // isPending: false,
  // signOut: async () => ({ error: null }),

});

// const AuthProvider: React.FC = () => {
//   return <div>AuthProvider</div>;
// };

// const useAuth = useContext({ auth: "hello" });

// AuthContext;

// export { AuthProvider, useAuth };
