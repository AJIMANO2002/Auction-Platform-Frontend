import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateAuction() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    startingprice: "",
    auctionType: "traditional",
    endTime: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setMessage("You must be logged in to create an auction.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/auctions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Auction created successfully!");
        setTimeout(() => navigate("/auctions"), 1000);
      } else {
        setMessage(data.message || "Error creating auction");
      }
    } catch (err) {
      setMessage("Server error");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6">Create New Auction</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={formData.image}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          name="startingprice"
          placeholder="Starting Price"
          value={formData.startingprice}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <select
          name="auctionType"
          value={formData.auctionType}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="traditional">Traditional</option>
          <option value="sealed">Sealed</option>
          <option value="reverse">Reverse</option>
        </select>
        <input
          type="datetime-local"
          name="endTime"
          value={formData.endTime}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Create Auction
        </button>
      </form>

      {message && <p className="mt-4 text-red-600">{message}</p>}
    </div>
  );
}
