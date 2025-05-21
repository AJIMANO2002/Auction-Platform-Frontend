import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Auctions() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auctions`);
        const data = await res.json();
        setAuctions(data);
      } catch (err) {
        console.error("Error fetching auctions", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Live Auctions</h2>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : auctions.length === 0 ? (
        <p className="text-gray-500">No auctions available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {auctions.map((auction) => (
            <Link
              to={`/auction/${auction._id}`}
              key={auction._id}
              className="bg-white shadow-md rounded-lg justify-items-center p-6 hover:shadow-lg transition"
            >
              <img
                src={auction.image || "https://via.placeholder.com/300x200?text=No+Image"}
                alt={auction.title}
                className=" h-72 object-cover rounded-2xl  mb-3"
              />
              <h3 className="text-xl font-semibold text-blue-600 mb-2">
                {auction.title}
              </h3>
              <p className="text-gray-600 mb-1">{auction.description}</p>
              <p className="text-sm text-gray-500">
                Starting Bid: ₹{auction.startingprice}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
