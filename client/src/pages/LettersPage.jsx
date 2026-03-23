import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Heart, Sparkles } from "lucide-react";
import API from "../services/api";

export default function LettersPage() {
  const navigate = useNavigate();
  const { surpriseId } = useParams();
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [openedLetters, setOpenedLetters] = useState(new Set());
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const response = await API.get(`/memory/${surpriseId}/letter`);
        const letterMemories = response.data;
        setMemories(letterMemories);
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

  const letters = [
    ...memories.map((memory, index) => ({
      id: `memory-${index}`,
      title: memory.heading || "A Special Letter",
      content: memory.message,
      ending: memory.ending || "With all my love",
      type: "memory",
      createdAt: memory.createdAt
    }))
  ];

  const handleOpenLetter = (letter) => {
    setSelectedLetter(letter);
    setOpenedLetters((prev) => new Set(prev).add(letter.id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-pink-950">
      <div className="sticky top-0 z-50 backdrop-blur-md bg-black/30 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(`/dashboard-unlocked/${surpriseId}`)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h1 className="text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300">
            Letters🤍....
          </h1>
          <div className="w-20" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <Sparkles className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-3xl md:text-5xl mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-yellow-300">
            Words From My Heart
          </h2>
          <p className="text-gray-400 text-lg">Click on the my heart to read</p>
        </motion.div>

        {letters.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💌</span>
            </div>
            <h3 className="text-2xl text-white mb-2">No letters yet</h3>
            <p className="text-gray-400">Share heartfelt messages to fill the letter collection!</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-12">
            {letters.map((letter, index) => (
              <motion.div key={letter.id} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.2 }} className="flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.05, y: -10 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleOpenLetter(letter)}
                  className="relative group"
                >
                  <div className="relative w-64 h-40">
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg shadow-2xl" />
                    <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-br from-pink-200 to-purple-200 origin-top rounded-t-lg" style={{ clipPath: "polygon(0 0, 100% 0, 50% 70%)" }} />
                    <div className="absolute top-12 left-1/2 transform -translate-x-1/2 z-10">
                      <div className="bg-pink-500 rounded-full p-3 shadow-lg">
                        <Heart className="w-6 h-6 text-white fill-white" />
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-purple-600 font-medium">Letter {letter.id}</div>
                    <motion.div
                      animate={{
                        boxShadow: [
                          "0 0 20px rgba(236, 72, 153, 0.3)",
                          "0 0 40px rgba(168, 85, 247, 0.5)",
                          "0 0 20px rgba(236, 72, 153, 0.3)",
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 rounded-lg -z-10"
                    />
                  </div>
                </motion.button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedLetter && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedLetter(null)} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl shadow-2xl max-w-2xl w-full p-8 md:p-12 relative overflow-hidden"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f59e0b' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
              }}
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-400 via-purple-400 to-yellow-400" />
              <button onClick={() => setSelectedLetter(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="relative">
                <motion.h3 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-3xl md:text-4xl mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 font-serif">
                  {selectedLetter.title}
                </motion.h3>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-gray-700 text-lg md:text-xl leading-relaxed mb-8" style={{ fontFamily: "'Crimson Text', serif" }}>
                  {selectedLetter.content.split("").map((char, index) => (
                    <motion.span key={index} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.01, delay: 0.5 + index * 0.02 }}>
                      {char}
                    </motion.span>
                  ))}
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + selectedLetter.content.length * 0.02 + 0.3 }} className="text-right">
                  <p className="text-2xl text-purple-600 italic" style={{ fontFamily: "'Dancing Script', cursive" }}>
                    {selectedLetter.ending}
                  </p>
                  <Heart className="w-6 h-6 text-pink-500 fill-pink-500 ml-auto mt-2" />
                </motion.div>
              </div>

              <div className="absolute top-8 left-8 text-yellow-400/30 text-4xl">❋</div>
              <div className="absolute top-8 right-8 text-yellow-400/30 text-4xl">❋</div>
              <div className="absolute bottom-8 left-8 text-yellow-400/30 text-4xl">❋</div>
              <div className="absolute bottom-8 right-8 text-yellow-400/30 text-4xl">❋</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
