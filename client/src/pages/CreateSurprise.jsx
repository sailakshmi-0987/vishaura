import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function CreateSurprise() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    birthdayPerson: "",
    birthdayDate: "",
    message: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await API.post("/surprise/create", form);

      // redirect to dashboard
      navigate("/dashboard");

    } catch (err) {
      setError("Failed to create surprise");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
      >

        <h2 className="text-2xl font-semibold mb-6 text-center">
          Create a Surprise 🎉
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-3">{error}</p>
        )}

        {/* Name */}
        <input
          type="text"
          name="birthdayPerson"
          placeholder="Birthday Person Name"
          className="w-full border p-3 mb-3 rounded-lg"
          onChange={handleChange}
          required
        />

        {/* Date */}
        <input
          type="date"
          name="birthdayDate"
          className="w-full border p-3 mb-3 rounded-lg"
          onChange={handleChange}
          required
        />

        {/* Message */}
        <textarea
          name="message"
          placeholder="Write a special message..."
          className="w-full border p-3 mb-4 rounded-lg"
          onChange={handleChange}
        />

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
        >
          {loading ? "Creating..." : "Create Surprise"}
        </button>

      </form>

    </div>
  );
}

export default CreateSurprise;