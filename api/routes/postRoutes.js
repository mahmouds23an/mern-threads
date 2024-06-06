import express from "express";

import { createPost } from "../controllers/postController.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

// Routes
// http://localhost:5000/api/posts/.....
router.post("/create",protectRoute, createPost);

export default router;
