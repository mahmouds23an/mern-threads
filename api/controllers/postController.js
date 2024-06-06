import Post from "../models/postModel.js";
import User from "../models/userModel.js";

const createPost = async (req, res) => {
  try {
    const { postedBy, text, img } = req.body;
    if (!postedBy || !text) {
      return res
        .status(400)
        .json({ message: "You must enter all required fields" });
    }
    const user = await User.findById(postedBy);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: "You are not authorized to create this post",
      });
    }
    const maxLength = 500;
    if (text.length > maxLength) {
      return res
        .status(400)
        .json({ message: `Text must be less than ${maxLength} characters` });
    }
    const newPost = new Post({ postedBy, img, text });
    await newPost.save();
    res.status(201).json({ message: "Post created successfully", newPost });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log("Error in createPostFn: ", err.message);
  }
};

export { createPost };