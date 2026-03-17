import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

function SurprisePage() {

  const { id } = useParams();

  const [surprise, setSurprise] = useState(null);
  const [memories, setMemories] = useState([]);
  const [unlocked, setUnlocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");

  // fetch surprise + unlock status
  const fetchData = async () => {
    try {
      const res1 = await API.get(`/surprise/${id}`);
      const res2 = await API.get(`/surprise/${id}/check`);

      setSurprise(res1.data);
      setUnlocked(res2.data.unlocked);

      if (res2.data.unlocked) {
        const res3 = await API.get(`/memory/${id}`);
        setMemories(res3.data);
      } else {
        startCountdown(res2.data.unlockTime);
      }

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // countdown logic
  const startCountdown = (unlockTime) => {

    const interval = setInterval(() => {

      const now = new Date();
      const unlock = new Date(unlockTime);
      const diff = unlock - now;

      if (diff <= 0) {
        setUnlocked(true);
        clearInterval(interval);
        fetchData();
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff / (1000 * 60)) % 60);
        const secs = Math.floor((diff / 1000) % 60);

        setTimeLeft(`${hours}h ${mins}m ${secs}s`);
      }

    }, 1000);
  };

  if (!surprise) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* Header */}
      <div className="text-center mb-8">

        <h1 className="text-3xl font-bold text-gray-800">
          🎉 {surprise.birthdayPerson}'s Surprise
        </h1>

        <p className="text-gray-500 mt-2">
          {surprise.message}
        </p>

      </div>

      {/* LOCKED VIEW */}
      {!unlocked ? (
        <div className="text-center">

          <h2 className="text-xl text-gray-600 mb-2">
            Surprise unlocks in
          </h2>

          <p className="text-3xl font-bold text-indigo-600">
            {timeLeft}
          </p>

        </div>
      ) : (

        /* UNLOCKED VIEW */
        <div>

          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Memories ❤️
          </h2>

          {memories.length === 0 ? (
            <p className="text-gray-500">No memories yet</p>
          ) : (

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {memories.map((mem) => (

                <div
                  key={mem._id}
                  className="bg-white p-4 rounded-xl shadow"
                >

                  {/* LETTER */}
                  {mem.type === "letter" && (
                    <p className="text-gray-700">{mem.message}</p>
                  )}

                  {/* IMAGE */}
                  {mem.type === "image" && (
                    <img
                      src={mem.fileUrl}
                      alt=""
                      className="rounded-lg"
                    />
                  )}

                  {/* VIDEO */}
                  {mem.type === "video" && (
                    <video controls className="w-full rounded-lg">
                      <source src={mem.fileUrl} />
                    </video>
                  )}

                  {/* AUDIO */}
                  {mem.type === "audio" && (
                    <audio controls className="w-full">
                      <source src={mem.fileUrl} />
                    </audio>
                  )}

                </div>

              ))}

            </div>
          )}

        </div>
      )}

    </div>
  );
}

export default SurprisePage;