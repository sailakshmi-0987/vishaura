import Memory from "../models/Memory.js";
import cloudinary from "../utils/cloudinary.js";
import Surprise from "../models/Surprise.js";

export const createMemory = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const { surprise, type, message, heading, ending } = req.body;

    if (!type) {
      return res.status(400).json({ error: "Type is required" });
    }

    // 🔥 Debug inviteCode
    console.log("Invite Code Received:", surprise);

    const surpriseDoc = await Surprise.findOne({ inviteCode: surprise });

    console.log("Found Surprise:", surpriseDoc);

    if (!surpriseDoc) {
      return res.status(400).json({ error: "Invalid invite code" });
    }

    let fileUrl = "";

    if (req.file) {
      const uploaded = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "auto" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      fileUrl = uploaded.secure_url;
    }

    const memory = await Memory.create({
      surprise: surpriseDoc._id,
      type,
      fileUrl,
      message,
      heading,
      ending
    });

    res.status(201).json(memory);

  } catch (error) {
    console.log("🔥 FULL ERROR:", error); // 👈 THIS IS KEY
    res.status(500).json({ error: error.message });
  }
};

export const getMemories = async (req, res) => {
  try {
    const memories = await Memory.find({
      surprise: req.params.surpriseId
    }).sort({ createdAt: -1 });

    res.json(memories);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMemoriesByType = async (req, res) => {
  try {
    const { type } = req.params;
    const memories = await Memory.find({
      surprise: req.params.surpriseId,
      type: type
    }).sort({ createdAt: -1 });

    res.json(memories);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};