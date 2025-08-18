import { useContext, useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

function Header2() {
  const auth = useContext(AuthContext);
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  if (!auth) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  // Fetch current user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (auth.isAuthenticated) {
          const res = await api.get("/api/users/me/");
          setUsername(res.data.username);
          setRole(res.data.role);
        } else {
          setUsername(null);
          setRole(null);
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

  const isManager = role === "manager";

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="flex justify-between items-center px-6 py-3 bg-gray-800 text-white">
      {/* Left side: Logo */}
      <Link to="/" className="text-lg font-bold">
        Restaurant App
      </Link>

      {/* Right side */}
      <div className="relative" ref={dropdownRef}>
        {auth.isAuthenticated ? (
          <>
            <button
              className="px-4 py-2 bg-gray-700 rounded"
              onClick={() => setOpen((prev) => !prev)}
            >
              Welcome, {username ?? "..."}
            </button>

            {open && (
              <div className="absolute right-0 mt-4 w-48 bg-gray-800 text-white shadow-lg z-50">
                <Link to="/" className="block px-4 py-2 hover:bg-gray-200">
                  Homepage
                </Link>
                <Link to="/orders" className="block px-4 py-2 hover:bg-gray-200">
                  Orders
                </Link>
                {isManager && (
                  <>
                    <Link to="/users" className="block px-4 py-2 hover:bg-gray-200">
                      Users
                    </Link>
                    <Link to="/menu" className="block px-4 py-2 hover:bg-gray-200">
                      Menu Items
                    </Link>
                  </>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-red-100 text-red-600"
                >
                  Logout
                </button>
              </div>
            )}
          </>
        ) : (
          <Link
            to="/login"
            className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-500"
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header2;