import express from "express";

import protect from "../middleware/authMiddleware.js";

import {
createSurprise,
getSurprise,
getUserSurprises
} from "../controllers/surpriseController.js";

const router = express.Router();

router.post("/create",protect,createSurprise);

router.get("/:id",getSurprise);

router.get("/user/all",protect,getUserSurprises);

router.get("/:id/check",checkUnlock);

router.get("/invite/:code",getByInviteCode);

export default router;