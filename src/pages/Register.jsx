import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user", 
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Registration failed");
      } else {
        toast.success("Registered! Please log in.");
        navigate("/login");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleRegister}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
          Register
        </h2>
        <input
          type="text"
          name="name"
          placeholder="Name"
          className="w-full mb-4 p-3 border rounded-lg"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full mb-4 p-3 border rounded-lg"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full mb-4 p-3 border rounded-lg"
          value={form.password}
          onChange={handleChange}
          required
        />

        <select
          name="role"
          className="w-full mb-4 p-3 border rounded-lg"
          value={form.role}
          onChange={handleChange}
        >
          <option value="user">User</option>
          <option value="seller">Seller</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
        >
          Register
        </button>

        <p className="text-center mt-4">
          Already have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}
