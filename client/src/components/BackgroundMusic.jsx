import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";

export default function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsMuted(true);
    } else {
      audioRef.current.play().catch(() => {});
      setIsMuted(false);
    }

    setIsPlaying(prev => !prev);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={togglePlay}
        className="relative bg-gradient-to-br from-pink-500 to-purple-500 rounded-full p-4 shadow-2xl"
      >
        <AnimatePresence mode="wait">
          {isMuted ? (
            <motion.div key="muted" initial={{ rotate: -180 }} animate={{ rotate: 0 }}>
              <VolumeX className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            <motion.div key="playing" initial={{ rotate: -180 }} animate={{ rotate: 0 }}>
              <Volume2 className="w-6 h-6 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <audio ref={audioRef} loop>
        <source
          src="/music/birthday.mp3"
          type="audio/mpeg"
        />
      </audio>
    </div>
  );
}