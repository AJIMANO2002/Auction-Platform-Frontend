import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-20 px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to AuctionPro 🔨</h1>
        <p className="text-lg mb-6">Bid smart. Win big. Start your auction journey today.</p>
        <div className="flex justify-center gap-4">
          <Link to="/auctions" className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100">
            Browse Auctions
          </Link>
          <Link to="/register" className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100">
            Get Started
          </Link>
        </div>
      </div>

      {/* Featured Auctions Preview */}
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Featured Auctions</h2>
        <p className="text-gray-600 mb-4">Log in to bid on exciting items, from gadgets to luxury gear.</p>
        <Link to="/auctions" className="text-blue-600 underline">
          View All Auctions →
        </Link>
      </div>
    </div>
  );
}
