import express from "express";

import protect from "../middleware/authMiddleware.js";

import {
createSurprise,
getSurprise,
getUserSurprises,
checkUnlock,
getByInviteCode
} from "../controllers/surpriseController.js";

import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/create",protect,upload.single("coverImage"),createSurprise);

router.get("/invite/:code",getByInviteCode);

router.get("/:id",getSurprise);

router.get("/user/all",protect,getUserSurprises);

router.get("/:id/check",checkUnlock);



export default router;