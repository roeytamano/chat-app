import express from "express";
import { signup, login, logout, updateProfile } from "../controllers/auth.controllers";
import { protectRoute } from "../middleware/auth.middleware";
import { arcjetProtection } from "../middleware/arcjet.middle";

const router = express.Router();

router.use(arcjetProtection);

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.put("/update-profile", protectRoute, updateProfile);

router.get("/check", protectRoute, (req, res) => res.status(200).json(req.user));
export default router;