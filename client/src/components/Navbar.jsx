import { Link } from "react-router-dom";
import logo from "../assets/logo.png"; // ✅ adjust path if needed

function Navbar() {
  return (
    <div className="flex justify-between items-center px-10 py-5 bg-white/70 backdrop-blur-md shadow-sm sticky top-0 z-50">

      {/* LEFT: Logo + Name */}
      <div className="flex items-center gap-3">

        <img
          src={logo}
          alt="Vishaura Logo"
          className="w-10 h-10 object-contain"
        />

        <h1 className="text-lg font-semibold text-gray-800 tracking-wide">
          VishAura
        </h1>

      </div>

        
      {/* RIGHT */}
      <div className="flex items-center gap-4">

        <Link to="/login" className="text-gray-600 hover:text-indigo-600 text-sm">
          Log In
        </Link>

        <Link
          to="/register"
          className="bg-gradient-to-r from-pink-500 to-orange-400 text-white px-4 py-2 rounded-full text-sm shadow hover:scale-105 transition"
        >
          Sign Up
        </Link>

      </div>

    </div>
  );
}

export default Navbar;