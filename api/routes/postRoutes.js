import express from "express";

import {
  createPost,
  getPost,
  deletePost,
  likeUnLikePost,
  replyOnPost,
  getFeedPosts,
  getUserPosts
} from "../controllers/postController.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

// Routes
// http://localhost:5000/api/posts/.....
router.get("/feed", protectRoute, getFeedPosts);
router.get("/:id", getPost);
router.get("/user/:username", getUserPosts);
router.post("/create", protectRoute, createPost);
router.delete("/:id", protectRoute, deletePost);
router.post("/like/:id", protectRoute, likeUnLikePost);
router.post("/reply/:id", protectRoute, replyOnPost);

export default router;
