import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow px-6 py-3 flex justify-between items-center">
      <Link to="/auctions" className="text-xl font-bold text-blue-600">
        AuctionHub
      </Link>

      <div className="flex items-center space-x-4">
        <Link to="/auctions" className="text-gray-700 hover:text-blue-600">
          Live Auctions
        </Link>

        {user ? (
          <>
            <Link
              to={user.role === "seller" ? "/seller-dashboard" : "/dashboard"}
              className="text-gray-700 hover:text-blue-600"
            >
              {user.role === "seller" ? "Dashboard" : "Dashboard"}
            </Link>

            {user.role === "seller" && (
              <Link to="/create-auction" className="text-gray-700 hover:text-blue-600">
                Create Auction
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-700 hover:text-blue-600">
              Login
            </Link>
            <Link to="/register" className="text-gray-700 hover:text-blue-600">
              Register
            </Link>
          </>
        )}

      </div>
    </nav>
  );
}
