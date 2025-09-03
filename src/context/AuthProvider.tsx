import { useEffect, useState, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import { jwtDecode } from "jwt-decode";

function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode<{ exp: number }>(token);
      const now = Date.now() / 1000;
      if (decoded.exp > now) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem("access_token");
        setIsAuthenticated(false);
      }
    } catch {
      localStorage.removeItem("access_token");
      setIsAuthenticated(false);
    }

    setLoading(false); // always mark finished
  }, []);

  const login = (access: string) => {
    localStorage.setItem("access_token", access);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;