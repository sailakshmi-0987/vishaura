import { useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function CreateSurprise({ onSuccess, onClose }) {
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    birthdayPerson: "",
    birthdayDate: "",
    message: "",
    coverImage: null,
    theme: "🎂 Classic Birthday"
  });

  const [inviteLink, setInviteLink] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ===== VALIDATION =====
  const isStep1Valid =
    form.birthdayPerson.trim() !== "" &&
    form.birthdayDate !== "";

  // ===== HANDLERS =====
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => {
    setForm({ ...form, coverImage: e.target.files[0] });
  };

  // ===== FINAL CREATE =====
  const handleSubmit = async () => {
    try {
      setLoading(true);

      const data = new FormData();
      data.append("birthdayPerson", form.birthdayPerson);
      data.append("birthdayDate", form.birthdayDate);
      data.append("message", form.message);
      data.append("theme", form.theme);
      if (form.coverImage) {
        data.append("coverImage", form.coverImage);
      }

      const res = await API.post("/surprise/create", data);

      const link = `${window.location.origin}/contribute/${res.data.inviteCode}`;
      setInviteLink(link);

      if (onSuccess) {
        onSuccess();
      } else {
        alert("🎉 Surprise Created Successfully!");
      }
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!onClose && <Navbar />}

      <div className={`${!onClose ? "pt-24 bg-gradient-to-br from-[#fdf2f8] to-[#f3f4f6] min-h-screen" : ""}`}>

        <div className={`${!onClose ? "max-w-3xl mx-auto px-6" : ""}`}>

          {/* ===== STEPPER ===== */}
          <div className="flex justify-center items-center gap-6 mb-10">

            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">

                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-full text-white text-sm font-semibold
                  ${step >= s ? "bg-pink-500" : "bg-gray-300"}`}
                >
                  {s}
                </div>

                <span
                  className={`text-sm ${
                    step >= s ? "text-black" : "text-gray-400"
                  }`}
                >
                  {s === 1 && "Basic Info"}
                  {s === 2 && "Customize"}
                  {s === 3 && "Invite"}
                </span>

                {s !== 3 && (
                  <div className="w-12 h-[2px] bg-gray-300"></div>
                )}

              </div>
            ))}
          </div>

          {/* ===== CARD ===== */}
          <div className="bg-white rounded-2xl shadow-lg p-8 relative">

           

            <h2 className="text-3xl font-semibold text-center mb-2">
              Create a Birthday Surprise
            </h2>

            <p className="text-center text-gray-500 mb-8">
              Let’s create an unforgettable celebration
            </p>

            {/* ================= STEP 1 ================= */}
            {step === 1 && (
              <div className="space-y-6">

                <div>
                  <label className="text-sm font-medium">
                    Who is this surprise for?
                  </label>
                  <input
                    name="birthdayPerson"
                    placeholder="Enter their name"
                    className="w-full mt-2 border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">
                    When is their birthday?
                  </label>
                  <input
                    type="date"
                    name="birthdayDate"
                    className="w-full mt-2 border p-3 rounded-lg focus:ring-2 focus:ring-pink-400"
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Choose a theme
                  </label>
                  <select 
                    name="theme"
                    value={form.theme}
                    onChange={handleChange}
                    className="w-full mt-2 border p-3 rounded-lg"
                  >
                    <option>🎂 Classic Birthday</option>
                    <option>🎉 Celebrations</option>
                    <option>✨ Minimalist</option>
                    <option>🎨 Fun and Colorful</option>
                    <option>💎 Elegant</option>
                  </select>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => setStep(2)}
                    disabled={!isStep1Valid}
                    className={`px-6 py-2 rounded-full text-white transition
                    ${
                      isStep1Valid
                        ? "bg-gradient-to-r from-pink-500 to-orange-400"
                        : "bg-gray-300 cursor-not-allowed"
                    }`}
                  >
                    Next Step →
                  </button>
                </div>

              </div>
            )}

            {/* ================= STEP 2 ================= */}
            {step === 2 && (
              <div className="space-y-6">

                {/* UPLOAD */}
                <div>
                  <label className="text-sm font-medium">
                    Upload a cover image
                  </label>

                  <div className="mt-2 border-2 border-dashed rounded-xl p-10 text-center hover:bg-gray-50 transition">

                    <input
                      type="file"
                      id="upload"
                      onChange={handleFile}
                      className="hidden"
                    />

                    <label htmlFor="upload" className="cursor-pointer">
                      <div className="text-3xl mb-2">📷</div>
                      <p className="text-gray-500">
                        Click to upload or drag & drop
                      </p>
                      <p className="text-xs text-gray-400">
                        PNG, JPG up to 10MB
                      </p>
                    </label>

                  </div>
                </div>

                {/* MESSAGE */}
                <div>
                  <label className="text-sm font-medium">
                    Opening message (Optional)
                  </label>

                  <textarea
                    name="message"
                    placeholder="Write a heartfelt message..."
                    className="w-full mt-2 border p-3 rounded-lg focus:ring-2 focus:ring-pink-400"
                    onChange={handleChange}
                  />
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => setStep(1)}
                    className="px-4 py-2 rounded-full bg-gray-100"
                  >
                    ← Back
                  </button>

                  <button
                    onClick={() => setStep(3)}
                    className="bg-gradient-to-r from-pink-500 to-orange-400 text-white px-6 py-2 rounded-full"
                  >
                    Next Step →
                  </button>
                </div>

              </div>
            )}

            {/* ================= STEP 3 ================= */}
            {step === 3 && (
              <div className="space-y-6 text-center">

                {/* INVITE CARD */}
                <div className="bg-orange-50 p-6 rounded-xl">

                  <div className="text-2xl mb-2">👥</div>

                  <h3 className="font-semibold text-lg">
                    Invite Friends & Family
                  </h3>

                  <p className="text-gray-500 text-sm">
                    Share this link with people to collect memories
                  </p>

                  <div className="flex mt-4 gap-2">

                    <input
                      value={inviteLink || "Create surprise to generate link"}
                      readOnly
                      className="flex-1 border p-3 rounded-lg"
                    />

                    <button
                      onClick={() => {
                        if (inviteLink) {
                          navigator.clipboard.writeText(inviteLink);
                          alert("Copied!");
                        }
                      }}
                      className="bg-pink-500 text-white px-4 rounded-lg"
                    >
                      Copy
                    </button>

                  </div>

                </div>

                {/* SHARE OPTIONS */}
                <div className="grid grid-cols-2 gap-4">

                  <div className="border p-4 rounded-xl">
                    <p className="font-medium">📧 Invite by Email</p>
                    <p className="text-sm text-gray-500">
                      Send personalized invites
                    </p>
                  </div>

                  <div className="border p-4 rounded-xl cursor-pointer" onClick={() => {
                    if (inviteLink) {
                      const text = `Join me in creating a birthday surprise for ${form.birthdayPerson}! ${inviteLink}`;
                      if (navigator.share) {
                        navigator.share({
                          title: 'Birthday Surprise Invite',
                          text: text,
                          url: inviteLink,
                        });
                      } else {
                        // Fallback: open WhatsApp
                        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                      }
                    }
                  }}>
                    <p className="font-medium">🔗 Share on Social</p>
                    <p className="text-sm text-gray-500">
                      WhatsApp, Instagram, etc.
                    </p>
                  </div>

                </div>

                {/* TIP */}
                <div className="bg-blue-50 text-sm p-4 rounded-lg text-gray-600">
                  💡 You can keep editing even after creation. The surprise
                  will unlock on the selected date.
                </div>

                {/* ACTIONS */}
                <div className="flex justify-between">

                  {inviteLink ? (
                    <>
                      <button
                        onClick={() => {
                          if (onClose) {
                            onClose();
                          } else {
                            navigate("/dashboard");
                          }
                        }}
                        className="px-4 py-2 rounded-full bg-gray-100"
                      >
                        {onClose ? "Close" : "Go to Dashboard"}
                      </button>

                      <button
                        onClick={() => {
                          setStep(1);
                          setForm({
                            birthdayPerson: "",
                            birthdayDate: "",
                            message: "",
                            coverImage: null,
                            theme: "🎂 Classic Birthday"
                          });
                          setInviteLink("");
                        }}
                        className="bg-pink-500 text-white px-6 py-2 rounded-full"
                      >
                        Create Another
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setStep(2)}
                        className="px-4 py-2 rounded-full bg-gray-100"
                      >
                        ← Back
                      </button>

                      <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-pink-500 text-white px-6 py-2 rounded-full"
                      >
                        {loading ? "Creating..." : "✔ Create Surprise"}
                      </button>
                    </>
                  )}

                </div>

              </div>
            )}

          </div>

        </div>

      </div>
    </>
  );
}

export default CreateSurprise;