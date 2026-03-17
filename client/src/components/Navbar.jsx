import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="flex justify-between items-center px-8 py-4 bg-white shadow-sm">

      <h1 className="text-xl font-semibold text-indigo-600">
        Vishaura
      </h1>

      <div className="flex gap-6 text-gray-700">

        <Link to="/" className="hover:text-indigo-600">Home</Link>
        <Link to="/login" className="hover:text-indigo-600">Login</Link>

      </div>

    </div>
  );
}

export default Navbar;