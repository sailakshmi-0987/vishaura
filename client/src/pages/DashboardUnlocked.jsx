import { motion } from "motion/react";
import { useNavigate, useParams } from "react-router";
import { Clock, Mail, Image, Video, Sparkles,Music } from "lucide-react";
import BackgroundMusic from "../components/BackgroundMusic";

export default function DashboardUnlocked() {
  const navigate = useNavigate();
  const { surpriseId } = useParams();

  const cards = [
    {
      id: 1,
      title: "Timeline",
      emoji: "📸",
      icon: Clock,
      description: "Our beautiful journey together",
      gradient: "from-pink-500 to-rose-500",
      path: `/timeline/${surpriseId}`,
    },
    {
      id: 2,
      title: "Letters",
      emoji: "💌",
      icon: Mail,
      description: "Words from the heart",
      gradient: "from-purple-500 to-pink-500",
      path: `/letters/${surpriseId}`,
    },
    {
      id: 3,
      title: "Images",
      emoji: "🖼️",
      icon: Image,
      description: "Captured moments of joy",
      gradient: "from-violet-500 to-purple-500",
      path: `/gallery/${surpriseId}`,
    },
    {
      id: 4,
      title: "Videos",
      emoji: "🎬",
      icon: Video,
      description: "The final surprise awaits",
      gradient: "from-fuchsia-500 to-violet-500",
      path: `/videos/${surpriseId}`,
    },
      {
    id: 5,
    title: "Audio",
    emoji: "🎧",
    icon: Music,
    description: "Voice notes & special songs",
    gradient: "from-blue-500 to-purple-500",
    path: `/audio/${surpriseId}`,
  },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-black via-purple-950 to-black">
      {/* Animated background elements */}
      <BackgroundMusic />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-12 md:mb-16"
        >
          <motion.div
            animate={{
              rotate: [0, 10, -10, 10, 0],
            }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="inline-block mb-4"
          >
            <Sparkles className="w-12 h-12 text-yellow-400" />
          </motion.div>
          <h1 className="text-4xl md:text-6xl mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-yellow-300">
            Choose your surprise 💖
          </h1>
          <p className="text-gray-400 text-lg md:text-xl">
            Every choice reveals a piece of my heart
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-6xl w-full">
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -10 }}
              onClick={() => navigate(card.path)}
              className="group cursor-pointer"
            >
              <div className="relative">
                {/* Card */}
                <div className="relative bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-10 overflow-hidden transition-all duration-300 group-hover:border-white/30">
                  {/* Gradient overlay on hover */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 0.1 }}
                    className={`absolute inset-0 bg-gradient-to-br ${card.gradient}`}
                  />

                  {/* Content */}
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-6xl">{card.emoji}</span>
                      <motion.div
                        animate={{
                          rotate: [0, 360],
                        }}
                        transition={{
                          duration: 20,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <card.icon className="w-8 h-8 text-gray-500 group-hover:text-pink-400 transition-colors" />
                      </motion.div>
                    </div>

                    <h3 className="text-2xl md:text-3xl mb-3 text-white">
                      {card.title}
                    </h3>
                    <p className="text-gray-400 text-base md:text-lg">
                      {card.description}
                    </p>

                    {/* Arrow indicator */}
                    <motion.div
                      className="mt-6 flex items-center gap-2 text-pink-400"
                      initial={{ x: 0 }}
                      whileHover={{ x: 10 }}
                    >
                      <span className="text-sm">Explore</span>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </motion.div>
                  </div>

                  {/* Glow effect */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300 -z-10`}
                  />
                </div>

                {/* External glow */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className={`absolute inset-0 bg-gradient-to-br ${card.gradient} rounded-3xl blur-2xl -z-20 opacity-0 group-hover:opacity-30 transition-opacity duration-300`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
