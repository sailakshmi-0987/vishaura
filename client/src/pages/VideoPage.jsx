import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Play, Pause, Volume2, VolumeX, Heart } from "lucide-react";
import API from "../services/api";

export default function VideoPage() {
  const navigate = useNavigate();
  const { surpriseId } = useParams();

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [videoMemories, setVideoMemories] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0); // ✅ NEW
  const [loading, setLoading] = useState(true);

  const videoRef = useRef(null);

  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const response = await API.get(`/memory/${surpriseId}/video`);
        setVideoMemories(response.data);
      } catch (error) {
        console.error("Error fetching memories:", error);
      } finally {
        setLoading(false);
      }
    };

    if (surpriseId) {
      fetchMemories();
    }
  }, [surpriseId]);

  const currentVideo = videoMemories[currentIndex]; // ✅ FIXED

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // ✅ AUTO NEXT VIDEO
  const handleVideoEnd = () => {
    if (currentIndex < videoMemories.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsPlaying(false);
    } else {
      setIsPlaying(false);
      setShowConfetti(true);
      setShowMessage(true);
      triggerConfetti();
    }
  };

  const triggerConfetti = () => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) return clearInterval(interval);

      if (window.confetti) {
        window.confetti({
          particleCount: 50,
          spread: 360,
          origin: { x: Math.random(), y: Math.random() - 0.2 },
        });
      }
    }, 250);
  };

  // ✅ MANUAL NAVIGATION
  const handleNext = () => {
    if (currentIndex < videoMemories.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsPlaying(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setIsPlaying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-pink-950 relative">

      {/* HEADER */}
      <div className="sticky top-0 z-40 backdrop-blur-md bg-black/30 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(`/dashboard-unlocked/${surpriseId}`)}
            className="flex items-center gap-2 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          <h1 className="text-xl text-pink-300">
            Video Surprise ✨
          </h1>

          <div className="w-20" />
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">

        {currentVideo ? (
          <div className="relative max-w-4xl w-full aspect-video rounded-2xl overflow-hidden">

            {/* VIDEO */}
            <video
              key={currentVideo._id}
              ref={videoRef}
              className="w-full h-full object-cover"
              onEnded={handleVideoEnd}
              muted={isMuted}
            >
              <source src={currentVideo.fileUrl} type="video/mp4" />
            </video>

            {/* PLAY BUTTON */}
            {!isPlaying && (
              <button
                onClick={handlePlayPause}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Play className="w-16 h-16 text-white" />
              </button>
            )}

            {/* CONTROLS */}
            <div className="absolute bottom-4 left-4 flex gap-4">
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

        {/* NAVIGATION BUTTONS */}
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
        <div className="fixed inset-0 flex items-center justify-center">
          <h1 className="text-5xl text-pink-300">
            Happy Birthday 🎉
          </h1>
        </div>
      )}

    </div>
  );
}