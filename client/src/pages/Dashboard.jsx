import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Dashboard() {

  const [surprises, setSurprises] = useState([]);
  const navigate = useNavigate();

  // fetch user surprises
  const fetchSurprises = async () => {
    try {
      const res = await API.get("/surprise/user/all");
      setSurprises(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSurprises();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">

        <h1 className="text-2xl font-semibold text-gray-800">
          Your Surprises 🎉
        </h1>

        <button
          onClick={() => navigate("/create")}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          + Create Surprise
        </button>

      </div>

      {/* Cards */}
      {surprises.length === 0 ? (
        <p className="text-gray-500">
          No surprises created yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {surprises.map((item) => (

            <div
              key={item._id}
              className="bg-white p-4 rounded-xl shadow hover:shadow-md transition"
            >

              <h2 className="text-lg font-semibold text-gray-800">
                {item.birthdayPerson}
              </h2>

              <p className="text-gray-500 text-sm mt-1">
                {new Date(item.birthdayDate).toDateString()}
              </p>

              {/* Actions */}
              <div className="mt-4 flex flex-col gap-2">

                <button
                  onClick={() => navigate(`/surprise/${item._id}`)}
                  className="text-indigo-600 text-sm"
                >
                  View Page
                </button>

                <button
                  onClick={() =>
                    navigator.clipboard.writeText(
                      `${window.location.origin}/contribute/${item.inviteCode}`
                    )
                  }
                  className="text-green-600 text-sm"
                >
                  Copy Invite Link
                </button>

              </div>

            </div>

          ))}

        </div>
      )}

    </div>
  );
}

export default Dashboard;