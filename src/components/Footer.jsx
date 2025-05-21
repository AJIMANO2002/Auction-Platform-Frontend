export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-10">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="text-center md:text-left">
          <h1 className="text-xl font-semibold">Auction Hub</h1>
          <p className="text-sm text-gray-400">© {new Date().getFullYear()} All rights reserved.</p>
        </div>

        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="#" className="text-gray-300 hover:text-white">Home</a>
          <a href="#" className="text-gray-300 hover:text-white">About</a>
          <a href="#" className="text-gray-300 hover:text-white">Contact</a>
        </div>
      </div>
    </footer>
  );
}
