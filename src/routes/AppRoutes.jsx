import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Navbar from "../components/Navbar";
import Home from "../pages/Home";
import Auctions from "../pages/Auctions";
import AuctionDetail from "../pages/AuctionDetail";
import CreateAuction from "../pages/CreateAuction";
import EditAuction from "../pages/EditAuction";
import SellerDashboard from "../pages/SellerDashboard";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Footer from "../components/Footer";

function ProtectedRoute({ children, role }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (role && user.role !== role) {
    return (
      <div className="p-10 text-center text-red-500">
        Unauthorized: You don’t have access to this page.
      </div>
    );
  }

  return children;
}

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}

function AppContent() {
  const location = useLocation();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Layout>
              <Home />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/auctions"
        element={
          <ProtectedRoute>
            <Layout>
              <Auctions />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/auction/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <AuctionDetail />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/create-auction"
        element={
          <ProtectedRoute role="seller">
            <Layout>
              <CreateAuction />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/auction/edit/:id"
        element={
          <ProtectedRoute role="seller">
            <Layout>
              <EditAuction />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/seller-dashboard"
        element={
          <ProtectedRoute role="seller">
            <Layout>
              <SellerDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />


     

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<Navigate to="/login" />} />

      <Route
        path="*"
        element={
          <h2 className="p-10 text-center text-gray-500">
            404 - Page Not Found
          </h2>
        }
      />
    </Routes>
  );
}

export default function AppRoutes() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
