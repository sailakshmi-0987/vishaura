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

  const currentVideo = videoMemories.length > 0 ? videoMemories[0] : null;

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

  const handleVideoEnd = () => {
    setIsPlaying(false);
    setShowConfetti(true);
    setShowMessage(true);
    triggerConfetti();
  };

  const triggerConfetti = () => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      // Using canvas-confetti if available, otherwise just animate
      if (window.confetti) {
        window.confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ["#ec4899", "#a855f7", "#fbbf24"],
        });
        window.confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ["#ec4899", "#a855f7", "#fbbf24"],
        });
      }
    }, 250);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-pink-950 relative">
      <div className="sticky top-0 z-40 backdrop-blur-md bg-black/30 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(`/dashboard-unlocked/${surpriseId}`)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h1 className="text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300">
            Final Surprise 🎬
          </h1>
          <div className="w-20" />
        </div>
      </div>

      <div className="relative z-10 min-h-[calc(100vh-73px)] flex flex-col items-center justify-center px-4 py-12">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-yellow-300">
            A Special Message for You
          </h2>
          <p className="text-gray-400 text-lg">Click play to watch ✨</p>
        </motion.div>

        {currentVideo ? (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="relative max-w-4xl w-full aspect-video rounded-2xl overflow-hidden shadow-2xl">
            <div className="relative w-full h-full bg-gradient-to-br from-purple-900 to-pink-900 flex items-center justify-center">
              <video ref={videoRef} className="w-full h-full object-cover" onEnded={handleVideoEnd} muted={isMuted} playsInline>
                <source src={currentVideo.fileUrl} type="video/mp4" />
              </video>

              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900/90 to-pink-900/90">
                  <div className="text-center">
                    <Heart className="w-24 h-24 text-pink-400 mx-auto mb-6 animate-pulse" />
                    <p className="text-white text-2xl md:text-3xl mb-2">Your Birthday Message</p>
                    <p className="text-gray-300 text-lg">Click play to watch ✨</p>
                  </div>
                </div>
              )}

              {!isPlaying && (
                <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handlePlayPause} className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="relative">
                    <div className="bg-pink-500 rounded-full p-8 shadow-2xl">
                      <Play className="w-16 h-16 text-white fill-white ml-2" />
                    </div>
                    <motion.div
                      animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 bg-pink-500 rounded-full blur-xl"
                    />
                  </div>
                </motion.button>
              )}

              {isPlaying && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <div className="flex items-center justify-between">
                    <button onClick={handlePlayPause} className="text-white hover:text-pink-400 transition-colors">
                      {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
                    </button>

                    <button onClick={handleMuteToggle} className="text-white hover:text-pink-400 transition-colors">
                      {isMuted ? <VolumeX className="w-8 h-8" /> : <Volume2 className="w-8 h-8" />}
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            <motion.div
              animate={{
                boxShadow: [
                  "0 0 40px rgba(236, 72, 153, 0.3)",
                  "0 0 80px rgba(168, 85, 247, 0.5)",
                  "0 0 40px rgba(236, 72, 153, 0.3)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute inset-0 rounded-2xl -z-10"
            />
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎬</span>
            </div>
            <h3 className="text-2xl text-white mb-2">No videos yet</h3>
            <p className="text-gray-400">Share a special video message to complete the surprise!</p>
          </motion.div>
        )}

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          onClick={handleVideoEnd}
          className="mt-8 px-6 py-3 bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 rounded-full text-pink-300 hover:bg-pink-500/30 transition-all duration-300"
        >
          Trigger Birthday Celebration (Demo)
        </motion.button>
      </div>

      {showMessage && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", duration: 1 }} className="text-center">
            <motion.h1
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl md:text-8xl mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-yellow-300"
            >
              Happy Birthday! 🎉
            </motion.h1>
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="flex items-center justify-center gap-4">
              <Heart className="w-12 h-12 text-pink-400 fill-pink-400 animate-pulse" />
              <p className="text-3xl md:text-4xl text-white">You are loved ❤️</p>
              <Heart className="w-12 h-12 text-pink-400 fill-pink-400 animate-pulse" />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
