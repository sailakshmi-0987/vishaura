import logo from "../assets/logo.png"; // adjust path

function Footer() {
  return (
    <footer className="mt-20 bg-gradient-to-br from-indigo-50 via-white to-purple-50">

      <div className="max-w-4xl mx-auto px-6 py-12 flex flex-col items-center text-center">

        {/* LOGO */}
        <img
          src={logo}
          alt="Vishaura Logo"
          className="w-12 h-12 object-contain mb-3"
        />

        {/* NAME */}
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Vishaura
        </h2>

        {/* DESCRIPTION */}
        <p className="text-gray-500 text-sm max-w-md leading-relaxed">
          Turn memories into unforgettable birthday surprises by bringing together
          photos, videos, voice messages, and heartfelt letters in one place.
        </p>

        {/* DIVIDER */}
        <div className="w-full h-px bg-gray-200 my-6"></div>

        {/* COPYRIGHT */}
        <p className="text-xs text-gray-400">
          © {new Date().getFullYear()} Vishaura. All rights reserved.
        </p>

      </div>

    </footer>
  );
}

export default Footer;