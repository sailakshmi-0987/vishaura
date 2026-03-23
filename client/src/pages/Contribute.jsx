import { useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

function Contribute() {
  const { code } = useParams();

  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [heading, setHeading] = useState("");
  const [ending, setEnding] = useState("");
  const [type, setType] = useState("image");

  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      formData.append("surprise", code);
      formData.append("type", type);

      if (file) {
        formData.append("file", file);
      }

      formData.append("message", message);
      formData.append("heading", heading);
      formData.append("ending", ending);

      // ✅ FIXED ENDPOINT
      await API.post("/memory/create", formData);

      alert("Memory saved ❤️");

      // reset form
      setFile(null);
      setMessage("");
      setHeading("");
      setEnding("");

    } catch (err) {
      console.log("Error:", err);
      alert("Failed to save memory ❌");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">

      <h1 className="text-2xl font-semibold mb-4 text-center">
        Add Memory 💖
      </h1>

      {/* TYPE SELECT */}
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="border p-2 rounded mb-4 w-full"
      >
        <option value="image">Gallery Photo</option>
        <option value="timeline-photo">Timeline Photo</option>
        <option value="video">Video</option>
        <option value="audio">Audio</option>
        <option value="letter">Letter</option>
      </select>

      {/* FILE INPUT */}
      {type !== "letter" && (
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-4 w-full"
        />
      )}

      {/* MESSAGE */}
      <textarea
        placeholder={
          type === "letter"
            ? "Write a heartfelt letter..."
            : "Write a caption..."
        }
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full border p-3 rounded mb-4"
      />

      {/* LETTER HEADING */}
      {type === "letter" && (
        <input
          type="text"
          placeholder="Letter heading (e.g., 'My Dearest Love')"
          value={heading}
          onChange={(e) => setHeading(e.target.value)}
          className="w-full border p-3 rounded mb-4"
        />
      )}

      {/* LETTER ENDING */}
      {type === "letter" && (
        <input
          type="text"
          placeholder="Letter ending (e.g., 'Forever Yours')"
          value={ending}
          onChange={(e) => setEnding(e.target.value)}
          className="w-full border p-3 rounded mb-4"
        />
      )}

      {/* SUBMIT BUTTON */}
      <button
        onClick={handleSubmit}
        className="bg-pink-500 hover:bg-pink-600 text-white px-5 py-2 rounded-full w-full"
      >
        Submit 💌
      </button>

    </div>
  );
}

export default Contribute;