import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function CreateAuction() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    startingprice: "",
    auctionType: "traditional",
    endTime: "",
  });

  const navigate = useNavigate();
  const [token, setToken] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setToken(parsedUser.token);
    }
  }, []);

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
      toast.error("You must be logged in to create an auction.");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/auctions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Auction creation failed");
        return;
      }

      toast.success("Auction created successfully!");
      navigate("/auctions");
    } catch (error) {
      console.error("Create auction error:", error);
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
          Create Auction
        </h2>

        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full mb-4 p-3 border rounded"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
          className="w-full mb-4 p-3 border rounded"
        />

        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={formData.image}
          onChange={handleChange}
          className="w-full mb-4 p-3 border rounded"
        />

        <input
          type="number"
          name="startingprice"
          placeholder="Starting Price"
          value={formData.startingprice}
          onChange={handleChange}
          required
          className="w-full mb-4 p-3 border rounded"
        />

        <select
          name="auctionType"
          value={formData.auctionType}
          onChange={handleChange}
          className="w-full mb-4 p-3 border rounded"
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
          className="w-full mb-4 p-3 border rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
        >
          Create Auction
        </button>
      </form>
    </div>
  );
}
