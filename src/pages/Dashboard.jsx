import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [myAuctions, setMyAuctions] = useState([]);
  const [myBids, setMyBids] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      navigate("/login");
    } else {
      setUser(storedUser);
      fetchUserData(storedUser.token);
    }
  }, [navigate, location.state?.refresh]); 

  const fetchUserData = async (token) => {
    try {
      const auctionsRes = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/auctions/my-auctions`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!auctionsRes.ok) throw new Error("Failed to fetch auctions");
      const auctionsData = await auctionsRes.json();
      setMyAuctions(Array.isArray(auctionsData) ? auctionsData : []);

      const bidsRes = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/bids/user/history`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!bidsRes.ok) throw new Error("Failed to fetch bids");
      const bidsData = await bidsRes.json();
      setMyBids(Array.isArray(bidsData) ? bidsData : []);
    } catch (error) {
      toast.error(`Dashboard fetch error: ${error.message}`);
      setMyAuctions([]);
      setMyBids([]);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Welcome, {user?.name || "User"} 
      </h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <p className="text-gray-600 mb-2">
          Email: <span className="font-medium">{user?.email}</span>
        </p>
        <p className="text-gray-600">
          Account Type: <span className="font-medium">{user?.role || "User"}</span>
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
        <p className="text-gray-500 mb-8">No auctions created yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          {myAuctions.map((auction) => (
            <div key={auction._id} className="bg-white p-4 rounded shadow">
              <img
                src={
                  auction.image ||
                  "https://via.placeholder.com/300x200?text=No+Image"
                }
                alt={auction.title}
                className="w-full h-32 object-cover rounded mb-2"
              />
              <h3 className="text-lg font-semibold">{auction.title}</h3>
              <p className="text-sm text-gray-600 mb-1">
                ₹{auction.startingprice}
              </p>
              <p className="text-xs text-gray-500 mb-2">
                Status: {auction.status}
              </p>
              <Link
                to={`/auction/${auction._id}`}
                className="text-blue-600 text-sm hover:underline"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-3">
          Your Bidding Activity
        </h2>
        {myBids.length === 0 ? (
          <p className="text-gray-500 italic">No bidding activity yet.</p>
        ) : (
          <ul className="space-y-3">
            {myBids.map((bid) => (
              <li
                key={bid._id}
                className="bg-white p-3 rounded shadow flex justify-between items-center"
              >
                <div>
                  <p className="text-gray-800">
                    Bid: ₹{bid.amount} on{" "}
                    <span className="font-semibold">{bid.auction.title}</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(bid.createdAt).toLocaleString()}
                  </p>
                </div>
                <Link
                  to={`/auction/${bid.auction._id}`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  View
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
