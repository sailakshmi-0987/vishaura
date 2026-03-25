import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

export default function VideoPage() {
  const navigate = useNavigate();
  const { surpriseId } = useParams();

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [videoMemories, setVideoMemories] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMessage, setShowMessage] = useState(false);

  const videoRef = useRef(null);

  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const res = await API.get(`/memory/${surpriseId}/video`);
        setVideoMemories(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    if (surpriseId) fetchMemories();
  }, [surpriseId]);

  const currentVideo = videoMemories[currentIndex];

  const handlePlayPause = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }

    setIsPlaying(!isPlaying);
  };

  const handleMuteToggle = () => {
    if (!videoRef.current) return;

    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVideoEnd = () => {
    if (currentIndex < videoMemories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsPlaying(false);
    } else {
      setShowMessage(true);
    }
  };

  const handleNext = () => {
    if (currentIndex < videoMemories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsPlaying(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsPlaying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-pink-950">

      {/* HEADER */}
      <div className="sticky top-0 z-40 bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(`/dashboard-unlocked/${surpriseId}`)}
            className="flex items-center gap-2 text-gray-400 hover:text-white"
          >
            <ArrowLeft size={20} />
            Back
          </button>

          <h1 className="text-pink-300 text-xl">Video Surprise ✨</h1>

          <div className="w-20" />
        </div>
      </div>

      {/* VIDEO SECTION */}
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">

        {currentVideo ? (
          <div className="relative max-w-4xl w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center shadow-2xl border border-white/10">

            {/* VIDEO */}
            <video
              key={currentVideo._id}
              ref={videoRef}
              className="max-h-[75vh] w-auto object-contain rounded-xl"
              onEnded={handleVideoEnd}
              muted={isMuted}
            >
              <source src={currentVideo.fileUrl} type="video/mp4" />
            </video>

            {/* PLAY OVERLAY */}
            {!isPlaying && (
              <button
                onClick={handlePlayPause}
                className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/60 transition"
              >
                <Play className="w-20 h-20 text-white drop-shadow-lg" />
              </button>
            )}

            {/* CONTROLS */}
            <div className="absolute bottom-4 left-4 flex gap-4 text-white">
              <button onClick={handlePlayPause}>
                {isPlaying ? <Pause /> : <Play />}
              </button>

              <button onClick={handleMuteToggle}>
                {isMuted ? <VolumeX /> : <Volume2 />}
              </button>
            </div>
          </div>
        ) : (
          <p className="text-white">No videos found</p>
        )}

        {/* NAV BUTTONS */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="bg-white/10 px-4 py-2 rounded disabled:opacity-30"
          >
            ⬅ Prev
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex === videoMemories.length - 1}
            className="bg-white/10 px-4 py-2 rounded disabled:opacity-30"
          >
            Next ➡
          </button>
        </div>
      </div>

      {/* FINAL MESSAGE */}
      {showMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70">
          <h1 className="text-5xl text-pink-300">Happy Birthday 🎉</h1>
        </div>
      )}
    </div>
  );
}