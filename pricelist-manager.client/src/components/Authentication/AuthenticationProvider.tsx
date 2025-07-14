import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import type { User } from "../../models/User";
import { useUser } from "../../hooks/users/useQueryUsers";

interface AuthContextType {
  user: User | undefined;
  isAuthenticated: boolean | undefined;
  login: (token: string) => void;
  logout: () => void;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

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
  const [user, setUser] = useState<User>();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(
    undefined
  );
  const [userId, setUserId] = useState<string>("");

  // Only call the hook when user is authenticated and we have a userId
  const userQuery = useUser(userId, {
    enabled: !!userId && isAuthenticated === true,
  });

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (!decodedToken.exp || decodedToken.exp * 1000 < Date.now()) {
          logout();
          return;
        }

        // Set the userId to trigger the user query
        setUserId(decodedToken.sub ?? "");

        setIsAuthenticated(true);
      } catch (error) {
        console.error(error);
        logout();
      }
    } else {
      // No token found, user is not authenticated
      setIsAuthenticated(false);
    }
  }, []);

  // Update user when userQuery data changes
  useEffect(() => {
    if (userQuery.data && userId) {
      setUser(userQuery.data);
      console.log("FROM USEEFFECT:", userQuery.data);
    }
  }, [userQuery.data, userId]);

  const login = (token: string) => {
    console.log("Login with token:", token);

    localStorage.setItem("jwtToken", token);
    const decodedToken = jwtDecode(token);

    // Set the userId to trigger the user query
    setUserId(decodedToken.sub ?? "");

    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("jwtToken");

    setUser(undefined);
    setIsAuthenticated(false);
  };

  const isAdmin = () => {
    return user?.roles.includes("Admin") ?? false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
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
