import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SellerDashboard() {
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const token = JSON.parse(localStorage.getItem("user"))?.token;

    useEffect(() => {
        const fetchMyAuctions = async () => {
            if (!token) {
                console.error("No token found. Redirecting to login...");
                navigate("/login");
                return;
            }

            try {
                const res = await fetch("http://localhost:8000/api/auctions/my-auctions", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                const data = await res.json();

                if (!res.ok) {
                    console.error("Error:", data.message);
                    setAuctions([]);
                } else {
                    setAuctions(data); // Ensure this is always an array
                }
            } catch (err) {
                console.error("Failed to load seller auctions:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMyAuctions();
    }, [token]);
    console.log("Token:", token);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure to delete this auction?")) return;

        try {
            const res = await fetch(`http://localhost:8000/api/auctions/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await res.json();
            alert(data.message);
            setAuctions(auctions.filter((a) => a._id !== id));
        } catch (err) {
            console.error("Delete failed:", err);
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">My Auctions</h2>

            {loading ? (
                <p>Loading...</p>
            ) : !Array.isArray(auctions) || auctions.length === 0 ? (
                <p className="text-gray-600">You have no auctions.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {auctions.map((auction) => (
                        <div key={auction._id} className="bg-white p-4 rounded shadow">
                            <img
                                src={auction.image || "https://via.placeholder.com/300x200?text=No+Image"}
                                alt={auction.title}
                                className="w-full h-40 object-cover mb-3 rounded"
                            />
                            <h3 className="text-xl font-semibold">{auction.title}</h3>
                            <p className="text-gray-500">{auction.description}</p>
                            <div className="mt-2 flex justify-between">
                                <Link
                                    to={`/edit-auction/${auction._id}`}
                                    className="text-blue-500 hover:underline"
                                >
                                    Edit
                                </Link>
                                <button
                                    onClick={() => handleDelete(auction._id)}
                                    className="text-red-500 hover:underline"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

    );
}
