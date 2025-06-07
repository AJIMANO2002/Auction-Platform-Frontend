import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function SellerDashboard() {
  const [user, setUser] = useState(null);
  const [myAuctions, setMyAuctions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || storedUser.role !== "seller") {
      toast.error("Unauthorized access");
      navigate("/login");
    } else {
      setUser(storedUser);
      fetchSellerAuctions(storedUser.token);
    }
  }, [navigate]);

  const fetchSellerAuctions = async (token) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auctions/my-auctions`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch auctions");
      const data = await res.json();
      setMyAuctions(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error(`Error loading auctions: ${err.message}`);
    }
  };

  const deleteAuction = async (auctionId) => {
    const confirm = window.confirm("Are you sure you want to delete this auction?");
    if (!confirm) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/auctions/${auctionId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Auction deleted");
      setMyAuctions(myAuctions.filter((a) => a._id !== auctionId));
    } catch (err) {
      toast.error(`Delete error: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Welcome, {user?.name} 🛍️
      </h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <p className="text-gray-600 mb-2">
          Email: <span className="font-medium">{user?.email}</span>
        </p>
        <p className="text-gray-600">
          Account Type: <span className="font-medium">Seller</span>
        </p>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Your Auctions</h2>
        <Link
          to="/create-auction"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Create Auction
        </Link>
      </div>

      {myAuctions.length === 0 ? (
        <p className="text-gray-500 italic">No auctions found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {myAuctions.map((auction) => (
            <div key={auction._id} className="bg-white p-4 rounded shadow">
              <img
                src={auction.image || "https://via.placeholder.com/300x200"}
                alt={auction.title}
                className="w-full h-32 object-cover rounded mb-2"
              />
              <h3 className="text-lg font-semibold">{auction.title}</h3>
              <p className="text-sm text-gray-600 mb-1">
                ₹{auction.startingprice}
              </p>
              <p className="text-xs text-gray-500 mb-2">Status: {auction.status}</p>

              <div className="flex justify-between mt-2">
                <Link
                  to={`/auction/edit/${auction._id}`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Edit
                </Link>
                <button
                  onClick={() => deleteAuction(auction._id)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>

              <Link
                to={`/auction/${auction._id}`}
                className="block text-blue-500 mt-2 text-sm hover:underline"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
