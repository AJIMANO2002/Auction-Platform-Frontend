import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";


function getAuctionStatus(auction) {
  const now = new Date();
  const start = new Date(auction.startTime || auction.startDate);
  const end = new Date(auction.endTime || auction.endDate);

  if (now < start) return "Upcoming";
  if (now >= start && now < end) return "Live";
  return "Ended";
}

export default function AuctionDetail() {
  const { id } = useParams();
  const [auction, setAuction] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bidsLoading, setBidsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const fetchAuction = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auctions/${id}`);
        const data = await res.json();
        setAuction(data);
      } catch (error) {
        console.error("Error loading auction:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchBids = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/bids/${id}`);
        const data = await res.json();
        setBids(data);
      } catch (err) {
        console.error("Error loading bids", err);
      } finally {
        setBidsLoading(false);
      }
    };

    fetchAuction();
    fetchBids();
  }, [id]);

  useEffect(() => {
    if (!auction?.endTime) return;

    const updateTimer = () => {
      const now = new Date();
      const end = new Date(auction.endTime);
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft("Auction ended");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [auction]);

  if (loading) return <p className="p-6">Loading auction details...</p>;
  if (!auction) return <p className="p-6 text-red-500">Auction not found.</p>;

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto justify-items-center bg-white shadow-md rounded-lg p-6">
        <img
          src={auction.image || "https://via.placeholder.com/300"}
          alt={auction.title}
          className="w-92 h-full object-cover rounded-lg mb-4"
        />
        <h2 className="text-3xl font-bold mb-2 text-blue-700">{auction.title}</h2>
        <p className="text-gray-700 mb-3">{auction.description}</p>
        <p className="text-gray-600">Starting Bid: ₹{auction.startingprice}</p>
        <p className="text-gray-800 font-semibold">Current Bid: ₹{auction.currentBid}</p>
        <p className="text-sm text-red-600 mt-2">Time Left: {timeLeft}</p>

        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-3">Bidding History</h3>
          {bidsLoading ? (
            <p>Loading bids...</p>
          ) : bids.length === 0 ? (
            <p>No bids yet.</p>
          ) : (
            <ul className="space-y-2">
              {bids.map((bid) => (
                <li key={bid._id} className="flex justify-between border-b pb-2">
                  <span className="text-gray-700">{bid.bidder?.name || "Anonymous"}</span>
                  <span className="font-medium">₹{bid.amount}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-3">Place a Bid</h2>

          {getAuctionStatus(auction) !== "Live" ? (
            <p className="text-red-600">This auction is not live currently.</p>
          ) : (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const amount = parseFloat(e.target.amount.value);

                if (!amount || amount <= auction.currentBid) {
                  toast.warn("Bid must be higher than the current bid.");
                  return;
                }

                const user = JSON.parse(localStorage.getItem("user"));
                const token = user?.token;

                if (!token) {
                  toast.error("Unauthorized. Please login again.");
                  return;
                }

                try {
                  const res = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/bids/${auction._id}`,
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify({ amount }),
                    }
                  );

                  const data = await res.json();
                  if (!res.ok) throw new Error(data.message || "Bid failed");

                  toast.success("Bid placed successfully!");
                  setAuction((prev) => ({ ...prev, currentBid: amount }));
                  setBids((prev) => [...prev, data.bid]);
                  e.target.reset();
                } catch (error) {
                  toast.error(error.message || "Something went wrong!");
                }
              }}
              className="bg-gray-50 p-4 rounded-md shadow"
            >
              <input
                type="number"
                name="amount"
                placeholder="Enter your bid amount"
                className="border p-2 rounded w-full mb-3"
                required
                min={auction.currentBid + 1}
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Submit Bid
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
