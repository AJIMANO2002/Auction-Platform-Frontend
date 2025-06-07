import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Dashboard = () => {
  const navigate = useNavigate();
  const [myBids, setMyBids] = useState([]);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    const token = parsedUser?.token;

    if (!token) {
      toast.error("Please log in to view your dashboard.");
      navigate("/login");
      return;
    }

    setUsername(parsedUser.username || parsedUser.name || "User");

    const fetchBids = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/bids/user/history`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch bids");

        const data = await res.json();
        setMyBids(Array.isArray(data) ? data : []);
      } catch (error) {
        toast.error(`Error: ${error.message}`);
        localStorage.removeItem("user");
        navigate("/login");
      }
    };

    fetchBids();
  }, [navigate]);

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold text-blue-600 mb-12">
        Welcome, {username} 🛍️ 
      </h1>


      <h2 className="text-xl font-semibold mb-3">🎯 Your Bids</h2>

      {myBids.length === 0 ? (
        <p className="text-gray-600">You haven't placed any bids yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {myBids.map((bid) => (
            <div
              key={bid._id}
              className="border rounded-lg shadow-sm p-4 hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold text-gray-800">
                {bid.auction?.title || "Auction Removed"}
              </h3>
              <p className="text-gray-600 mt-1"> Bid Amount: ₹{bid.amount}</p>
              <p className="text-gray-500 text-sm mt-1">
                Date: {new Date(bid.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
