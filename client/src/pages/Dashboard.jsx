import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { motion } from "framer-motion";
import logo from "../assets/logo.png";
import CreateSurprise from "./CreateSurprise";

function Dashboard() {
  const [surprises, setSurprises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const navigate = useNavigate();

  const fetchSurprises = async () => {
    try {
      const res = await API.get("/surprise/user/all");
      setSurprises(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSurpriseCreated = () => {
    setShowCreateModal(false);
    fetchSurprises();
  };

  useEffect(() => {
    fetchSurprises();
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">

      {/* SIDEBAR */}
      <div className="w-64 bg-gradient-to-b from-pink-600 to-orange-500 text-white flex flex-col p-5">

        <div className="flex items-center gap-3 mb-8">
          <img src={logo} className="w-10 h-10" />
          <h1 className="text-lg font-semibold tracking-wide text-white">
            VishAura
          </h1>
        </div>

        <nav className="space-y-3">
          <div className="bg-white/20 p-2 rounded-lg">Dashboard</div>
          <div className="p-2 hover:bg-white/20 rounded-lg cursor-pointer">My Surprises</div>
          <div className="p-2 hover:bg-white/20 rounded-lg cursor-pointer">Invitations</div>
          <div className="p-2 hover:bg-white/20 rounded-lg cursor-pointer">Media Uploads</div>
          <div className="p-2 hover:bg-white/20 rounded-lg cursor-pointer">Settings</div>
        </nav>
      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* TOP BAR */}
        <div className="flex justify-between items-center bg-white px-8 py-4 shadow-sm">
          <h1 className="text-xl font-semibold">Dashboard</h1>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-pink-600 text-white px-5 py-2 rounded-full hover:bg-pink-700 transition"
            >
              + Create New Surprise
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-8">

          <h2 className="text-3xl font-semibold mb-1">My Surprises</h2>
          <p className="text-gray-500 mb-6">
            Manage and create birthday surprise pages for your loved ones
          </p>

          {loading ? (
            <div className="text-center p-8">Loading your surprises...</div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">

              {/* CREATE CARD */}
              <div
                onClick={() => setShowCreateModal(true)}
                className="border-2 border-dashed border-purple-300 rounded-2xl flex flex-col items-center justify-center h-[260px] cursor-pointer hover:bg-purple-50 transition"
              >
                <div className="text-4xl text-gray-300 mb-2">＋</div>
                <p className="font-medium text-gray-600">Create New Surprise</p>
                <p className="text-sm text-gray-400">
                  Start a new birthday surprise page
                </p>
              </div>

              {/* SURPRISE CARDS */}
              {surprises.map((item) => {
                const contributors = item.contributors || 0;
                const media = item.mediaCount || 0;
                const daysLeft = Math.max(
                  0,
                  Math.ceil(
                    (new Date(item.birthdayDate) - new Date()) /
                      (1000 * 60 * 60 * 24)
                  )
                );

                return (
                  <motion.div
                    key={item._id}
                    whileHover={{ y: -6 }}
                    className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-4 flex flex-col justify-between"
                  >
                    {/* IMAGE */}
                    <div className="h-32 rounded-xl overflow-hidden relative">
                      <img
                        src={item.coverImage || "https://picsum.photos/400/300"}
                        className="w-full h-full object-cover"
                      />

                      <span className="absolute top-2 right-2 bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
                        Active
                      </span>
                    </div>

                    {/* CONTENT */}
                    <div className="mt-4">
                      <h3 className="font-semibold text-lg">
                        {item.birthdayPerson}
                      </h3>

                      <p className="text-gray-500 text-sm mb-3">
                        Birthday:{" "}
                        {new Date(item.birthdayDate).toDateString()}
                      </p>

                      {/* STATS (FIXED) */}
                      <div className="flex justify-between mb-4 text-sm">
                        <div className="bg-pink-50 px-3 py-2 rounded-lg text-center w-full mr-1">
                          <p className="font-bold">{contributors}</p>
                          <p className="text-gray-400 text-xs">Contributors</p>
                        </div>

                        <div className="bg-yellow-50 px-3 py-2 rounded-lg text-center w-full mx-1">
                          <p className="font-bold">{media}</p>
                          <p className="text-gray-400 text-xs">Media</p>
                        </div>

                        <div className="bg-blue-50 px-3 py-2 rounded-lg text-center w-full ml-1">
                          <p className="font-bold">{daysLeft}</p>
                          <p className="text-gray-400 text-xs">Days Left</p>
                        </div>
                      </div>

                      {/* ACTIONS */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => window.open(`/surprise/${item._id}`, '_blank')}
                          className="bg-pink-600 text-white px-3 py-1 rounded-md text-sm w-full"
                        >
                          View
                        </button>

                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(
                              `${window.location.origin}/contribute/${item.inviteCode}`
                            );
                            alert("Link copied!");
                          }}
                          className="bg-gray-100 px-3 py-1 rounded-md text-sm"
                        >
                          Share
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* CREATE SURPRISE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700 text-3xl font-light"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <CreateSurprise onSuccess={handleSurpriseCreated} onClose={() => setShowCreateModal(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;