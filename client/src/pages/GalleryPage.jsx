import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, X, ChevronLeft, ChevronRight } from "lucide-react";
import Masonry from "react-responsive-masonry";
import API from "../services/api";

export default function GalleryPage() {
  const navigate = useNavigate();
  const { surpriseId } = useParams();
  const [selectedImage, setSelectedImage] = useState(null);
  const [columnCount, setColumnCount] = useState(3);
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const response = await API.get(`/memory/${surpriseId}/image`);
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

  const images = [
    ...memories.map((memory, index) => ({
      id: `memory-${index}`,
      url: memory.fileUrl,
      caption: memory.message || "A special memory",
      type: "memory"
    }))
  ];

  useEffect(() => {
    const updateColumnCount = () => {
      if (window.innerWidth >= 1024) {
        setColumnCount(3);
      } else if (window.innerWidth >= 768) {
        setColumnCount(2);
      } else {
        setColumnCount(1);
      }
    };

    updateColumnCount();
    window.addEventListener("resize", updateColumnCount);
    return () => window.removeEventListener("resize", updateColumnCount);
  }, []);

  const handlePrevious = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage - 1 + images.length) % images.length);
    }
  };

  const handleNext = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % images.length);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black">
      <div className="sticky top-0 z-40 backdrop-blur-md bg-black/30 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(`/dashboard-unlocked/${surpriseId}`)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h1 className="text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300">
            Photo Gallery 💕
          </h1>
          <div className="w-20" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-yellow-300">
            Captured Moments
          </h2>
          <p className="text-gray-400 text-lg">Every picture tells our story</p>
        </motion.div>

        {images.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📷</span>
            </div>
            <h3 className="text-2xl text-white mb-2">No photos yet</h3>
            <p className="text-gray-400">Share some beautiful moments to fill the gallery!</p>
          </motion.div>
        ) : (
          <Masonry columnsCount={columnCount} gutter="1.5rem">
            {images.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                onClick={() => setSelectedImage(index)}
                className="cursor-pointer group relative overflow-hidden rounded-xl"
              >
                <div className="relative overflow-hidden rounded-xl">
                  <img src={image.url} alt={image.caption} className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110" />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white text-lg">{image.caption}</p>
                    </div>
                  </div>

                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ boxShadow: "0 0 30px rgba(236, 72, 153, 0.5)" }}
                  />
                </div>
              </motion.div>
            ))}
          </Masonry>
        )}
      </div>

      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button onClick={() => setSelectedImage(null)} className="absolute top-4 right-4 text-white hover:text-pink-400 transition-colors z-10">
              <X className="w-8 h-8" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevious();
              }}
              className="absolute left-4 text-white hover:text-pink-400 transition-colors z-10"
            >
              <ChevronLeft className="w-12 h-12" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-4 text-white hover:text-pink-400 transition-colors z-10"
            >
              <ChevronRight className="w-12 h-12" />
            </button>

            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="relative max-w-5xl max-h-[90vh]">
              <img src={images[selectedImage].url} alt={images[selectedImage].caption} className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" />

              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="absolute -bottom-16 left-0 right-0 text-center">
                <p className="text-white text-xl md:text-2xl">{images[selectedImage].caption}</p>
                <p className="text-gray-400 text-sm mt-2">
                  {selectedImage + 1} / {images.length}
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
