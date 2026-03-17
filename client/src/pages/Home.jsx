import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function Home() {
  return (
    <div className="min-h-screen bg-gray-50">

      <Navbar />

      <div className="flex flex-col items-center justify-center h-[85vh] text-center px-4">

        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Vishaura 🎉
        </h1>

        <p className="text-lg text-gray-600 max-w-xl mb-8">
          Turn memories into unforgettable birthday surprises.  
          Collect photos, videos, and heartfelt messages in one place.
        </p>

        <div className="flex gap-4">

          <Link
            to="/register"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow hover:bg-indigo-700 transition"
          >
            Create Surprise
          </Link>

          <Link
            to="/login"
            className="border border-gray-300 px-6 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition"
          >
            Login
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Home;