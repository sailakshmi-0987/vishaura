import { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import API from "../services/api";

function Contribute() {
  const { code } = useParams();

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");
  const [heading, setHeading] = useState("");
  const [ending, setEnding] = useState("");
  const [type, setType] = useState("image");

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);

    if (selected) {
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("surprise", code);
      formData.append("type", type);

      if (file) {
        formData.append("file", file);
      }

      formData.append("message", message);
      formData.append("heading", heading);
      formData.append("ending", ending);

      await API.post("/memory/create", formData);

      setToast({ type: "success", text: "Memory saved ❤️" });

      // ✅ RESET EVERYTHING
      setFile(null);
      setPreview(null);
      setMessage("");
      setHeading("");
      setEnding("");
      setType("image");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

    } catch (err) {
      setToast({ type: "error", text: "Failed to save ❌" });
    } finally {
      setLoading(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-purple-950 to-pink-950 px-4">

      {/* CARD */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6 w-full max-w-xl shadow-2xl"
      >

        <h1 className="text-3xl text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300">
          Add Memory 💖
        </h1>

        {/* TYPE SELECT */}
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full p-3 mb-4 bg-black/60 text-white rounded border border-white/20"
        >
          <option value="image" className="text-black">Gallery Photo</option>
          <option value="timeline-photo" className="text-black">Timeline Photo</option>
          <option value="video" className="text-black">Video</option>
          <option value="audio" className="text-black">Audio</option>
          <option value="letter" className="text-black">Letter</option>
        </select>

        {/* FILE INPUT */}
        {type !== "letter" && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              className="mb-4 w-full text-white"
            />

            {preview && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-4"
              >
                {(type === "image" || type === "timeline-photo") ? (
                  <img src={preview} className="rounded-lg w-full" />
                ) : (
                  <video src={preview} controls className="rounded-lg w-full" />
                )}
              </motion.div>
            )}
          </>
        )}

        {/* MESSAGE */}
        <textarea
          placeholder={type === "letter" ? "Write a heartfelt letter..." : "Write a caption..."}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-3 mb-4 bg-white/10 text-white placeholder-gray-400 rounded"
        />

        {/* LETTER FIELDS */}
        {type === "letter" && (
          <>
            <input
              type="text"
              placeholder="Letter heading"
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              className="w-full p-3 mb-4 bg-white/10 text-white rounded"
            />

            <input
              type="text"
              placeholder="Letter ending"
              value={ending}
              onChange={(e) => setEnding(e.target.value)}
              className="w-full p-3 mb-4 bg-white/10 text-white rounded"
            />
          </>
        )}

        {/* SUBMIT BUTTON */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold"
        >
          {loading ? "Uploading..." : "Submit 💌"}
        </motion.button>
      </motion.div>

      {/* TOAST */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`fixed bottom-6 px-6 py-3 rounded-full shadow-lg text-white ${
              toast.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {toast.text}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default Contribute;