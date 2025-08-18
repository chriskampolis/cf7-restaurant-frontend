import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

function Header() {
  const auth = useContext(AuthContext);
  const [username, setUsername] = useState<string | null>(null);
  const navigate = useNavigate();

  if (!auth) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (auth.isAuthenticated) {
          const res = await api.get("/api/users/me/");
          setUsername(res.data.username);
        } else {
          setUsername(null);
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    fetchUser();
  }, [auth.isAuthenticated]);

  const handleLogout = () => {
    auth.logout();
    navigate("/login");
  };

  return (
    <header className="flex justify-between items-center px-6 py-3 bg-gray-800 text-white">
      <Link to="/" className="text-lg font-bold">
        Restaurant App
      </Link>

      {auth.isAuthenticated ? (
        <div className="flex items-center gap-4">
          <span>Welcome, {username ?? "..."}</span>
          <button
            onClick={handleLogout}
            className="bg-red-600 px-3 py-1 rounded hover:bg-red-500"
          >
            Logout
          </button>
        </div>
      ) : (
        <Link
          to="/login"
          className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-500"
        >
          Login
        </Link>
      )}
    </header>
  );
}

export default Header;