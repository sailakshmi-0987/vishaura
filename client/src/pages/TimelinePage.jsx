import { motion, useInView } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Heart } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import API from "../services/api";

function TimelineItemComponent({ item, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const isLeft = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="relative flex items-center justify-center mb-16 md:mb-20"
    >
      <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="relative"
        >
          <div className="w-4 h-4 bg-pink-500 rounded-full" />
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-pink-500 rounded-full"
          />
        </motion.div>
      </div>

      <div
        className={`w-full md:w-5/12 ${
          isLeft ? "md:pr-12 text-right" : "md:pl-12 md:ml-auto text-left"
        }`}
      >
        <div className="group">
          <motion.div
            whileHover={{ scale: 1.05, rotate: isLeft ? -2 : 2 }}
            className="bg-white p-3 rounded-lg shadow-2xl transform transition-all duration-300 relative"
            style={{ rotate: isLeft ? -3 : 3 }}
          >
            <div className="relative overflow-hidden rounded-md mb-3 aspect-[4/3]">
              {item.memoryType === 'video' ? (
                <video 
                  src={item.image} 
                  className="w-full h-full object-cover" 
                  controls
                  preload="metadata"
                />
              ) : (
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>

            <div className="px-2 pb-2">
              <p className="text-gray-400 text-xs mb-1">{item.date}</p>
              <h3 className="text-black text-lg mb-1">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.description}</p>
            </div>

            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={isInView ? { scale: 1, rotate: 0 } : {}}
              transition={{ delay: 0.6, type: "spring" }}
              className="absolute -top-2 -right-2 bg-pink-500 rounded-full p-2 shadow-lg"
            >
              <Heart className="w-4 h-4 text-white fill-white" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default function TimelinePage() {
  const navigate = useNavigate();
  const { surpriseId } = useParams();
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const response = await API.get(`/memory/${surpriseId}`);
        setMemories(response.data);
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

  // Combine static timeline data with dynamic memories
  const timelineData = [
    ...memories.filter(memory => memory.type === 'timeline-photo').map(memory => ({
      date: new Date(memory.createdAt).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long'
      }),
      title: `Shared photo`,
      description: memory.message || `A beautiful photo memory`,
      image: memory.fileUrl || "https://images.unsplash.com/photo-1760348082270-3a46a3512850?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMG1vbWVudHMlMjBjZWxlYnJhdGlvbnxlbnwxfHx8fDE3NzQxNjQ0MTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      type: "memory",
      memoryType: memory.type
    })),
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black">
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
            Our Timeline 🩷
          </h1>
          <div className="w-20" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16 md:mb-24">
          <h2 className="text-3xl md:text-5xl mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-yellow-300">
            Every Moment with You
          </h2>
          <p className="text-gray-400 text-lg">A journey through our beautiful memories</p>
        </motion.div>

        <div className="relative">
          {timelineData.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
              <Heart className="w-16 h-16 text-pink-400 mx-auto mb-4" />
              <h3 className="text-2xl text-white mb-2">No memories yet</h3>
              <p className="text-gray-400">Share your first memory to start the timeline!</p>
            </motion.div>
          ) : (
            <>
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-pink-500 via-purple-500 to-yellow-500" />
              {timelineData.map((item, index) => (
                <TimelineItemComponent key={index} item={item} index={index} />
              ))}
            </>
          )}
        </div>

        <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ type: "spring" }} className="flex justify-center mt-12">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-white fill-white" />
            </div>
            <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 bg-pink-500 rounded-full blur-lg" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
