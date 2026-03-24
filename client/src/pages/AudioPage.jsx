import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Play, Pause, Volume2, VolumeX, Heart } from "lucide-react";
import API from "../services/api";

export default function AudioPage() {
  const navigate = useNavigate();
  const { surpriseId } = useParams();

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [audioMemories, setAudioMemories] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const audioRef = useRef(null);

  useEffect(() => {
    const fetchAudios = async () => {
      try {
        const res = await API.get(`/memory/${surpriseId}/audio`);
        setAudioMemories(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    if (surpriseId) fetchAudios();
  }, [surpriseId]);

  const currentAudio = audioMemories[currentIndex];

  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }

    setIsPlaying(!isPlaying);
  };

  const handleMute = () => {
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // 🔥 Auto next
  const handleAudioEnd = () => {
    if (currentIndex < audioMemories.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsPlaying(false);
    } else {
      setShowConfetti(true);
      setShowMessage(true);
      triggerConfetti();
    }
  };

  const triggerConfetti = () => {
    if (!window.confetti) return;

    const duration = 4000;
    const end = Date.now() + duration;

    const interval = setInterval(() => {
      if (Date.now() > end) return clearInterval(interval);

      window.confetti({
        particleCount: 40,
        spread: 360,
        origin: { x: Math.random(), y: Math.random() - 0.2 },
      });
    }, 250);
  };

  const handleNext = () => {
    if (currentIndex < audioMemories.length - 1) {
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
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-pink-950">

      {/* HEADER */}
      <div className="sticky top-0 z-40 backdrop-blur-md bg-black/30 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(`/dashboard-unlocked/${surpriseId}`)}
            className="flex items-center gap-2 text-gray-400 hover:text-white"
          >
            <ArrowLeft />
            Back
          </button>

          <h1 className="text-xl text-pink-300">
            Audio Memories 🎧
          </h1>

          <div className="w-20" />
        </div>
      </div>

      {/* MAIN */}
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">

        {currentAudio ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative max-w-xl w-full p-10 rounded-2xl bg-gradient-to-br from-purple-900 to-pink-900 shadow-2xl text-center"
          >

            {/* HEART ICON */}
            <Heart className="w-20 h-20 text-pink-400 mx-auto mb-6 animate-pulse" />

            <h2 className="text-2xl text-white mb-4">
              A Special Voice Message 💖
            </h2>

            {/* AUDIO */}
            <audio
              key={currentAudio._id}
              ref={audioRef}
              onEnded={handleAudioEnd}
              muted={isMuted}
            >
              <source src={currentAudio.fileUrl} />
            </audio>

            {/* CONTROLS */}
            <div className="flex justify-center gap-6 mt-6">

              <button onClick={handlePlayPause}>
                {isPlaying ? (
                  <Pause className="w-10 h-10 text-white" />
                ) : (
                  <Play className="w-10 h-10 text-white" />
                )}
              </button>

              <button onClick={handleMute}>
                {isMuted ? (
                  <VolumeX className="w-10 h-10 text-white" />
                ) : (
                  <Volume2 className="w-10 h-10 text-white" />
                )}
              </button>
            </div>

            {/* NAV */}
            <div className="flex justify-between mt-8">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="text-white/60"
              >
                ⬅ Prev
              </button>

              <button
                onClick={handleNext}
                disabled={currentIndex === audioMemories.length - 1}
                className="text-white/60"
              >
                Next ➡
              </button>
            </div>
          </motion.div>
        ) : (
          <p className="text-white text-xl">
            No audio yet 🎧
          </p>
        )}

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