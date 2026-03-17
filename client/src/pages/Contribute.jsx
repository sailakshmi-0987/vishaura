import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

function Contribute() {

  const { code } = useParams();

  const [surprise, setSurprise] = useState(null);

  const [form, setForm] = useState({
    type: "letter",
    message: "",
    file: null
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // fetch surprise
  const fetchSurprise = async () => {
    try {
      const res = await API.get(`/surprise/invite/${code}`);
      setSurprise(res.data);
    } catch (err) {
      setError("Invalid or expired link");
    }
  };

  useEffect(() => {
    if (code) {
      fetchSurprise();
    }
  }, [code]);

  // input change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // file change
  const handleFile = (e) => {
    setForm({
      ...form,
      file: e.target.files[0]
    });
  };

  // submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const data = new FormData();

      data.append("surprise", surprise._id);
      data.append("type", form.type);
      data.append("message", form.message);

      if (form.file) {
        data.append("file", form.file);
      }

      await API.post("/memory/create", data);

      // success message
      setSuccess("Memory added successfully ❤️");

      // reset form
      setForm({
        type: "letter",
        message: "",
        file: null
      });

      window.scrollTo(0, 0);

    } catch (err) {
      setError("Failed to upload memory");
    } finally {
      setLoading(false);
    }
  };

  // loading state
  if (!surprise && !error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  // error state
  if (error && !surprise) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-2 text-center">
          Add Memory 🎉
        </h2>

        <p className="text-center text-gray-500 mb-4">
          For <span className="font-medium">{surprise.birthdayPerson}</span>
        </p>
        {success && (
          <p className="text-green-600 text-sm mb-3 text-center">
            {success}
          </p>
        )}
        {error && (
          <p className="text-red-500 text-sm mb-3 text-center">
            {error}
          </p>
        )}
        <select
          name="type"
          className="w-full border p-3 mb-3 rounded-lg"
          value={form.type}
          onChange={handleChange}
        >
          <option value="letter">Letter</option>
          <option value="image">Image</option>
          <option value="video">Video</option>
          <option value="audio">Audio</option>
        </select>
        <textarea
          name="message"
          placeholder="Write something special..."
          className="w-full border p-3 mb-3 rounded-lg"
          value={form.message}
          onChange={handleChange}
        />
        {form.type !== "letter" && (
          <input
            type="file"
            className="w-full mb-4"
            onChange={handleFile}
          />
        )}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
        >
          {loading ? "Uploading..." : "Submit Memory"}
        </button>

      </form>

    </div>
  );
}

export default Contribute;