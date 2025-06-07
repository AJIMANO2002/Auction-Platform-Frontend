import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Auctions() {
  const [auctions, setAuctions] = useState([]);
  const [filteredAuctions, setFilteredAuctions] = useState([]);
  const [filter, setFilter] = useState("live");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auctions`);
        const data = await res.json();
        setAuctions(data);
        applyFilter(data, filter);
      } catch (err) {
        console.error("Error fetching auctions", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  const applyFilter = (data, status) => {
    const now = new Date();
    const filtered = data.filter((auction) => {
      const start = new Date(auction.startTime);
      const end = new Date(auction.endTime);

      if (status === "live") return now >= start && now < end;
      if (status === "ended") return now >= end;
      if (status === "upcoming") return now < start;
      return true;
    });

    setFilteredAuctions(filtered);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    applyFilter(auctions, newFilter);
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 capitalize">
        {filter} Auctions
      </h2>

      <div className="flex gap-4 mb-6">
        {["live", "ended", "upcoming"].map((f) => (
          <button
            key={f}
            onClick={() => handleFilterChange(f)}
            className={`px-4 py-2 rounded ${filter === f ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : filteredAuctions.length === 0 ? (
        <p className="text-gray-500">No auctions available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredAuctions.map((auction) => (
            <Link
              to={`/auction/${auction._id}`}
              key={auction._id}
              className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition"
            >
              <img
                src={auction.image || "https://via.placeholder.com/300x200?text=No+Image"}
                alt={auction.title}
                className="h-72 object-cover rounded-2xl mb-3"
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
