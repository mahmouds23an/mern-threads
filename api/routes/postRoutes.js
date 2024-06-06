import express from "express";

import {
  createPost,
  getPost,
  deletePost,
} from "../controllers/postController.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

// Routes
// http://localhost:5000/api/posts/.....
router.post("/create", protectRoute, createPost);
router.get("/:id", protectRoute, getPost);
router.delete("/:id", protectRoute, deletePost);

export default router;
