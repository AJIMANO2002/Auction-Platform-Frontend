import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, } from "react-router-dom";
import Navbar from "../components/Navbar";
import Home from "../pages/Home";
import Auctions from "../pages/Auctions";
import AuctionDetail from "../pages/AuctionDetail";
import CreateAuction from "../pages/CreateAuction";
import SellerDashboard from "../pages/SellerDashboard";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";

function ProtectedRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));
  return user ? children : <Navigate to="/login" />;
}

function Layout() {
  const location = useLocation();
  const hideNavbar = ["/login", "/register"].includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/auctions" element={<Auctions />} />
        <Route path="/auction/:id" element={<AuctionDetail />} />
        <Route path="/create-auction" element={<CreateAuction />} />
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/seller-dashboard"
          element={
            <ProtectedRoute>
              <SellerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<h2 className="p-10 text-center text-gray-500">404 - Page Not Found</h2>} />
      </Routes>
    </>
  );
}

export default function AppRoutes() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}
