import express from "express";

import { signupUser, loginUser, logoutUser, followUnFollowUser } from "../controllers/userController.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

// Routes
// http://localhost:5000/api/users/.....
router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/follow/:id", protectRoute, followUnFollowUser);

export default router;
