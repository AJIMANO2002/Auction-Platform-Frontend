import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed.user); 
    } else {
      setUser(null);
    }
  }, [location]);

  const hideNavbar = location.pathname === "/" || location.pathname === "/register";
  if (hideNavbar) return null;

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between flex-wrap items-center shadow">
      <div className="text-lg font-bold cursor-pointer" onClick={() => navigate("/home")}>
        AuctionHub
      </div>

      <ul className="flex gap-4 items-center">
        <li>
          <Link to="/home" className="hover:underline">Home</Link>
        </li>
        <li>
          <Link to="/auctions" className="hover:underline">Auctions</Link>
        </li>

        {user?.role === "user" && (
          <li>
            <Link to="/dashboard" className="hover:underline">Dashboard</Link>
          </li>
        )}

        {user?.role === "seller" && (
          <>
            <li>
              <Link to="/seller-dashboard" className="hover:underline">Seller Dashboard</Link>
            </li>
            <li>
              <Link to="/create-auction" className="hover:underline">Create Auction</Link>
            </li>
          </>
        )}

        <li>
          <button onClick={handleLogout} className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100">
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
}
