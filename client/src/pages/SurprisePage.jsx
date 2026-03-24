import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Lock, Unlock, Heart, Volume2, VolumeX } from "lucide-react";
import API from "../services/api";


function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsMuted(true);
    } else {
      audioRef.current.play().catch(() => {
        // auto-play may fail in some browsers; keep muted state as fallback
      });
      setIsMuted(false);
    }

    setIsPlaying((prev) => !prev);
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
            <motion.div
              key="muted"
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 180, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <VolumeX className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="playing"
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 180, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Volume2 className="w-6 h-6 text-white" />
            </motion.div>
          )}
        </AnimatePresence>

        {isPlaying && (
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-pink-500 rounded-full"
          />
        )}
      </motion.button>

      <audio ref={audioRef} loop preload="auto">
        {/* Add your music source here */}
        <source
          src="/music/birthday.mp3"
          type="audio/mpeg"
        />
      </audio>

      {!isPlaying && (
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute right-full mr-4 top-1/2 transform -translate-y-1/2 whitespace-nowrap bg-black/80 text-white px-3 py-2 rounded-lg text-sm"
        >
          Play Background Music 🎵
        </motion.div>
      )}
    </div>
  );
}


function LoadingScreen({ loadingDone }) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: loadingDone ? 0 : 1 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 bg-gradient-to-br from-black via-purple-950 to-pink-950 z-50 flex items-center justify-center"
      style={{ pointerEvents: loadingDone ? "none" : "auto" }}
    >
      <div className="text-center">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="mb-8"
        >
          <Heart className="w-20 h-20 text-pink-500 fill-pink-500 mx-auto" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-3xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-yellow-300"
        >
          Loading your surprise...
        </motion.h1>
      </div>
    </motion.div>
  );
}

function SurprisePage() {
  const { id } = useParams();

  const [surprise, setSurprise] = useState(null);
  const [memories, setMemories] = useState([]);
  const [unlocked, setUnlocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const navigate = useNavigate();
  const [showUnlock, setShowUnlock] = useState(false);
  const [showBurst, setShowBurst] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [loadingDone, setLoadingDone] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res1 = await API.get(`/surprise/${id}`);
      const res2 = await API.get(`/surprise/${id}/check`);

      setSurprise(res1.data);
      setTimeout(() => setLoadingDone(true), 4000);
      setUnlocked(res2.data.unlocked);

      if (res2.data.unlocked) {
        const res3 = await API.get(`/memory/${id}`);
        setMemories(res3.data);
        // Navigate to dashboard after loading
        setTimeout(() => {
          navigate(`/dashboard-unlocked/${id}`);
        }, 1500);
      } else {
        startCountdown(res2.data.unlockTime);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleUnlock = () => {
    setShowBurst(true);
    setIsUnlocking(true);
    setTimeout(() => {
      setUnlocked(true);
    }, 500);
    setTimeout(() => {
      navigate(`/dashboard-unlocked/${id}`);
    }, 2000);
  };

  const startCountdown = (unlockTime) => {
    const interval = setInterval(() => {
      const now = new Date();
      const unlock = new Date(unlockTime);
      const diff = unlock - now;

      if (diff <= 0) {
        setShowUnlock(true);
        clearInterval(interval);
      } else {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        });
      }
    }, 1000);
  };

  if (!surprise) {
    return <LoadingScreen loadingDone={loadingDone} />;
  }

  return (
   <div className="min-h-screen bg-black text-white">
    <BackgroundMusic />
    <LoadingScreen loadingDone={loadingDone} />

  {/* HERO */}
  <div
    className="relative h-[420px] flex items-center justify-center text-center"
    style={{
      backgroundImage: `url(${surprise.coverImage || "https://picsum.photos/1200/600"})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >

    {/* DARK OVERLAY */}
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

    {/* CONTENT */}
    <div className="relative z-10 max-w-2xl px-6">

      <h1 className="text-5xl font-bold tracking-tight">
        Happiest Birthday Ever {surprise.birthdayPerson} 💗❣️🫂
      </h1>

      <p className="mt-4 text-lg text-gray-200">
        {surprise.message}
      </p>

    </div>

  </div>

  {/* Conditional Rendering */}
  {!unlocked && !showUnlock ? (
    <div className="relative overflow-hidden bg-gradient-to-br from-black via-purple-950 to-black min-h-screen flex flex-col items-center justify-center px-4">
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-pink-400 rounded-full"
            animate={{
              x: [0, Math.random() * 200 - 100],
              y: [0, -window.innerHeight],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 5,
            }}
            style={{
              left: Math.random() * 100 + "%",
              top: "100%",
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-12"
        >
          <Sparkles className="w-12 h-12 text-yellow-400 mx-auto mb-4 animate-pulse" />
          <h1 className="text-2xl md:text-4xl text-gray-300 mb-2">
            Something special is waiting for you...
          </h1>
        </motion.div>

        {/* Countdown Timer */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-12">
          {[
            { label: "Days", value: timeLeft.days },
            { label: "Hours", value: timeLeft.hours },
            { label: "Minutes", value: timeLeft.minutes },
            { label: "Seconds", value: timeLeft.seconds },
          ].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center"
            >
              <div className="relative">
                <motion.div
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(236, 72, 153, 0.3)",
                      "0 0 40px rgba(168, 85, 247, 0.5)",
                      "0 0 20px rgba(236, 72, 153, 0.3)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="bg-black/50 backdrop-blur-sm border border-pink-500/30 rounded-2xl p-6 md:p-8 min-w-[100px] md:min-w-[140px]"
                >
                  <span className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-pink-400 via-purple-400 to-yellow-400">
                    {String(item.value).padStart(2, "0")}
                  </span>
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-2xl blur-xl -z-10" />
              </div>
              <p className="text-gray-400 mt-4 text-sm md:text-base uppercase tracking-wider">
                {item.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  ) : showUnlock ? (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-black via-purple-950 to-pink-950">
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full"
            animate={{
              y: [0, -1000],
              x: [0, Math.random() * 200 - 100],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
            style={{
              left: Math.random() * 100 + "%",
              top: "100%",
            }}
          />
        ))}
      </div>

      {/* Light burst effect */}
      <AnimatePresence>
        {showBurst && (
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 3, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="w-96 h-96 bg-gradient-radial from-pink-400 via-purple-400 to-transparent rounded-full blur-3xl" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Lock Icon */}
          <motion.div
            animate={
              isUnlocking
                ? { rotate: 360, scale: 1.2 }
                : {
                    rotate: [0, -5, 5, -5, 5, 0],
                  }
            }
            transition={
              isUnlocking
                ? { duration: 1 }
                : {
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3,
                  }
            }
            className="relative inline-block mb-12"
          >
            <div className="relative">
              <AnimatePresence mode="wait">
                {!isUnlocking ? (
                  <motion.div
                    key="locked"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
                    className="relative"
                  >
                    <Lock className="w-32 h-32 md:w-40 md:h-40 text-pink-400" strokeWidth={1.5} />
                    <motion.div
                      animate={{
                        boxShadow: [
                          "0 0 30px rgba(236, 72, 153, 0.5)",
                          "0 0 60px rgba(168, 85, 247, 0.8)",
                          "0 0 30px rgba(236, 72, 153, 0.5)",
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 rounded-full blur-2xl -z-10"
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="unlocked"
                    initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    className="relative"
                  >
                    <Unlock className="w-32 h-32 md:w-40 md:h-40 text-yellow-400" strokeWidth={1.5} />
                    <motion.div
                      animate={{
                        boxShadow: ["0 0 60px rgba(251, 191, 36, 0.8)"],
                      }}
                      className="absolute inset-0 rounded-full blur-2xl -z-10"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-5xl mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-yellow-300">
              {isUnlocking ? "Welcome! ✨" : "Ready for your surprise?"}
            </h1>
            <p className="text-gray-400 text-lg md:text-xl">
              {isUnlocking
                ? "Get ready for something magical..."
                : "Click below to unlock your birthday gift"}
            </p>
          </motion.div>

          {/* Unlock Button */}
          {!isUnlocking && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleUnlock}
              className="group relative px-8 md:px-12 py-4 md:py-5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full text-white text-lg md:text-xl font-medium overflow-hidden transition-all duration-300"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500"
                initial={{ x: "100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
              <span className="relative z-10 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Unlock your surprise
                <Sparkles className="w-5 h-5" />
              </span>
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(236, 72, 153, 0.5)",
                    "0 0 40px rgba(168, 85, 247, 0.8)",
                    "0 0 20px rgba(236, 72, 153, 0.5)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-full -z-10"
              />
            </motion.button>
          )}
        </motion.div>
      </div>
    </div>
  ) : (
    /* UNLOCKED */
    <div className="max-w-6xl mx-auto px-6 py-16">

  <h2 className="text-3xl font-semibold text-center mb-12 text-white">
    Memories 💖
  </h2>

  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">

    {memories.map((mem) => (

      <div
        key={mem._id}
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl overflow-hidden shadow-xl hover:scale-105 transition"
      >

        {/* MEDIA */}
        {mem.fileUrl && (
          <>
            {mem.type === "image" && (
              <img
                src={mem.fileUrl}
                className="w-full h-60 object-cover"
              />
            )}

            {mem.type === "video" && (
              <video controls className="w-full h-60 object-cover">
                <source src={mem.fileUrl} />
              </video>
            )}

            {mem.type === "audio" && (
              <div className="p-4">
                🎧
                <audio controls className="w-full mt-2">
                  <source src={mem.fileUrl} />
                </audio>
              </div>
            )}
          </>
        )}

        {/* CAPTION */}
        {mem.message && mem.type !== "letter" && (
          <div className="p-4 text-white text-sm">
            💬 {mem.message}
          </div>
        )}

        {/* LETTER */}
        {mem.type === "letter" && (
          <div className="p-6 bg-gradient-to-br from-pink-100 to-purple-100 text-gray-800">
            💌 {mem.message}
          </div>
        )}

      </div>

    ))}

  </div>

</div>
  )}

</div>
  );
}

export default SurprisePage;