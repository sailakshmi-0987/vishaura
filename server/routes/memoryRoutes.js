import express from "express";

import upload from "../middleware/uploadMiddleware.js";

import {
createMemory,
getMemories
} from "../controllers/memoryController.js";

const router = express.Router();

router.post("/create",upload.single("file"),createMemory);

router.get("/:surpriseId",getMemories);

export default router;