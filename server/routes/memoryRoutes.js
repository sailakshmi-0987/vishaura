import express from "express";

import upload from "../middleware/uploadMiddleware.js";

import {
createMemory,
getMemories,
getMemoriesByType
} from "../controllers/memoryController.js";

const router = express.Router();

router.post("/create", (req, res, next) => {
  console.log("✅ ROUTE HIT");
  next();
}, upload.single("file"), createMemory);

router.get("/:surpriseId",getMemories);
router.get("/:surpriseId/:type",getMemoriesByType);

export default router;