import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function EditAuction() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [auction, setAuction] = useState(null);
  const [form, setForm] = useState({ title: "", startingprice: "", image: "" });

  const token = JSON.parse(localStorage.getItem("user"))?.token;

  useEffect(() => {
    const fetchAuction = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auctions/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Auction not found");
        const data = await res.json();
        setAuction(data);
        setForm({
          title: data.title,
          startingprice: data.startingprice,
          image: data.image || "",
        });
      } catch (err) {
        toast.error(`Error: ${err.message}`);
        navigate("/seller-dashboard");
      }
    };

    fetchAuction();
  }, [id, token, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auctions/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to update auction");
      toast.success("Auction updated successfully!");
      navigate("/seller-dashboard");
    } catch (err) {
      toast.error(`Update error: ${err.message}`);
    }
  };

  if (!auction) return <p className="p-4">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Auction</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Starting Price</label>
          <input
            type="number"
            name="startingprice"
            value={form.startingprice}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Image URL</label>
          <input
            type="text"
            name="image"
            value={form.image}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Update Auction
        </button>
      </form>
    </div>
  );
}
