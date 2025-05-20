import { Link } from "react-router-dom";

export default function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-600">
        AuctionZone
      </Link>

      <div className="space-x-4">
        <Link to="/" className="text-gray-700 hover:text-blue-600">
          Home
        </Link>
        <Link to="/auctions" className="text-gray-700 hover:text-blue-600">
          Auctions
        </Link>

        {user?.role === "seller" && (
          <Link to="/seller-dashboard" className="text-gray-700 hover:text-blue-600">
            My Auctions
          </Link>
        )}

        {user ? (
          <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">
            Dashboard
          </Link>
        ) : (
          <Link to="/login" className="text-gray-700 hover:text-blue-600">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
