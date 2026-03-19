import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function Home() {
  return (
    <>
      {/* NAVBAR */}
      <Navbar />

      {/* MAIN WRAPPER */}
      <div className="relative pt-20 bg-gradient-to-br from-[#f9fafb] via-[#eef2ff] to-[#fdf2f8] overflow-hidden">

        {/* BACKGROUND GLOW */}
        <div className="absolute top-10 left-10 w-80 h-80 bg-purple-200 blur-3xl opacity-30 rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-pink-200 blur-3xl opacity-30 rounded-full"></div>

        {/* ================= HERO ================= */}
        <section className="max-w-6xl mx-auto px-6 md:px-10 py-24 grid md:grid-cols-2 gap-20 items-center relative z-10">

          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.15] text-gray-900">
              Create{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">
                unforgettable
              </span>{" "}
              birthday surprises
            </h1>

            <p className="text-gray-600 mt-6 text-lg leading-relaxed max-w-lg">
              Collect photos, videos, voice notes, and heartfelt messages from
              loved ones — all in one beautiful surprise.
            </p>

            <div className="flex gap-4 mt-8">
              <Link
                to="/register"
                className="bg-indigo-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-indigo-700 hover:scale-105 transition"
              >
                Start Creating
              </Link>

              <button className="px-6 py-3 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition">
                View Demo
              </button>
            </div>
          </motion.div>

          {/* RIGHT VISUAL */}
          <div className="relative flex justify-center items-center h-[420px]">

            {/* MAIN IMAGE */}
            <motion.div
              className="relative w-64 h-80 rounded-3xl overflow-hidden shadow-2xl scale-105 z-20"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 5 }}
            >
              <img
                src="https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=800"
                className="w-full h-full object-cover"
              />

              <div className="absolute bottom-4 left-4 text-white text-sm font-semibold">
                Memories ❤️
              </div>
            </motion.div>

            {/* LEFT IMAGE */}
            <motion.img
              src="https://picsum.photos/300/500?random=1"
              className="absolute w-44 h-64 object-cover rounded-2xl shadow-xl left-6 rotate-[-10deg] opacity-90"
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
            />

            {/* RIGHT IMAGE */}
            <motion.img
              src="https://picsum.photos/300/500?random=2"
              className="absolute w-44 h-64 object-cover rounded-2xl shadow-xl right-6 rotate-[10deg] opacity-90"
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4.5 }}
            />

          </div>
        </section>

        {/* DIVIDER */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-10"></div>

        {/* ================= FEATURES ================= */}
        <section className="max-w-6xl mx-auto px-6 md:px-10 py-20 relative z-10">

          <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12">
            Everything you need to create{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">
              magical moments
            </span>
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">

            {[
              { title: "Photo Memories", icon: "📸" },
              { title: "Video Messages", icon: "🎥" },
              { title: "Voice Notes", icon: "🎤" },
              { title: "Secret Letters", icon: "💌" },
              { title: "Countdown Surprise", icon: "⏳" },
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -6 }}
                className="bg-white/80 backdrop-blur-lg p-5 rounded-2xl shadow-md hover:shadow-xl transition"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-indigo-100 mb-4 text-xl">
                  {item.icon}
                </div>

                <h3 className="font-semibold text-gray-800">
                  {item.title}
                </h3>

                <p className="text-gray-500 text-sm mt-2">
                  Create meaningful memories effortlessly.
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <Footer />
      </div>
    </>
  );
}

export default Home;