import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { jwtDecode } from "jwt-decode";
import type { User } from "../../models/User";
import { useUser } from "../../hooks/users/useQueryUsers";
import BasicLoader from "../Loader/BasicLoader";

interface AuthContextType {
  user: User | undefined;
  isAuthenticated: boolean | undefined;
  login: (token: string) => void;
  logout: () => void;
  isAdmin: () => boolean;
  isLoading: boolean;
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
  const [isInitialized, setIsInitialized] = useState(false);

  // Only call the hook when user is authenticated and we have a userId
  const userQuery = useUser(userId, {
    enabled: !!userId && isAuthenticated === true,
  });

  const logout = useCallback(() => {
    console.log("Logging out...");
    localStorage.removeItem("jwtToken");
    setUser(undefined);
    setUserId("");
    setIsAuthenticated(false);
    setIsInitialized(true);
  }, []);

  const processToken = useCallback(
    (token: string) => {
      try {
        const decodedToken = jwtDecode(token);

        // Check if token is expired
        if (!decodedToken.exp || decodedToken.exp * 1000 < Date.now()) {
          console.error("Token is expired");
          logout();
          return false;
        }

        console.log("Processing token, userId:", decodedToken.sub);
        setUserId(decodedToken.sub ?? "");
        setIsAuthenticated(true);
        setIsInitialized(true);
        return true;
      } catch (error) {
        console.error("Error decoding token:", error);
        logout();
        return false;
      }
    },
    [logout]
  );

  const login = useCallback(
    (token: string) => {
      console.log("Login with token:", token);

      localStorage.setItem("jwtToken", token);

      processToken(token);
    },
    [processToken]
  );

  // Initialize authentication state on app start
  useEffect(() => {
    const initializeAuth = () => {
      console.log("Initializing authentication...");
      const token = localStorage.getItem("jwtToken");

      if (!token) {
        console.log("No token found");
        setIsAuthenticated(false);
        setIsInitialized(true);
        return;
      }

      processToken(token);
    };

    initializeAuth();
  }, [processToken]);

  // Update user when userQuery data changes
  useEffect(() => {
    if (userQuery.data && userId) {
      console.log("User data received:", userQuery.data);
      setUser(userQuery.data);
    }
  }, [userQuery.data, userId]);

  // Handle user query errors
  useEffect(() => {
    if (userQuery.isError && isAuthenticated) {
      console.error("Error fetching user data:", userQuery.error);
      logout();
    }
  }, [userQuery.isError, userQuery.error, isAuthenticated, logout]);

  const isAdmin = useCallback(() => {
    return user?.roles.includes("Admin") ?? false;
  }, [user?.roles]);

  // Show loading while initializing or fetching user data
  const isLoading = !isInitialized || (userId ? userQuery.isPending : false);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        isAdmin,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthenticationProvider;
