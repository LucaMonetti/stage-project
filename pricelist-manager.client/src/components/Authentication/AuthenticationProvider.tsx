import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode, type JwtPayload } from "jwt-decode";

interface AuthContextType {
  user: string | undefined;
  isAuthenticated: boolean;
  role: string | undefined;
  login: (token: string) => void;
  logout: () => void;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

type CustomJwtPayload = JwtPayload & {
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const AuthenticationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<string>();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [role, setRole] = useState<string>();

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      try {
        const decodedToken = jwtDecode<CustomJwtPayload>(token);
        if (!decodedToken.exp || decodedToken.exp * 1000 < Date.now()) {
          logout();
          return;
        }

        setUser(decodedToken.sub);
        setIsAuthenticated(true);

        setRole(
          decodedToken[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ] ?? ""
        );
      } catch (error) {
        console.error("Failed to decode JWT token:", error);
        logout();
      }
    }
  }, []);

  const login = (token: string) => {
    console.log("Login with token:", token);

    localStorage.setItem("jwtToken", token);
    const decodedToken = jwtDecode<CustomJwtPayload>(token);

    const userRole =
      decodedToken[
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
      ] ?? "";

    setUser(decodedToken.sub);
    setIsAuthenticated(true);
    setRole(userRole);
  };

  const logout = () => {
    localStorage.removeItem("jwtToken");

    setUser(undefined);
    setIsAuthenticated(false);
    setRole(undefined);
  };

  const isAdmin = () => {
    return role === "Admin";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        role,
        login,
        logout,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthenticationProvider;
