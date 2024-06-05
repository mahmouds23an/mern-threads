import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/helpers/generateTokenAndSetCookie.js";

const signupUser = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;
    // check exist of user by checking email or username
    const user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ message: "User already exist" });
    }
    // if not exist hash password using bcryptjs
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // create new user in DB
    const newUser = new User({
      name,
      email,
      username,
      password: hashedPassword,
    });
    await newUser.save();
    if (newUser) {
      // generate token
      generateTokenAndSetCookie(newUser._id, res); // we send res as a 2nd parameter because it own cookies
      // send response
      res.status(201).json({
        message: "User created successfully",
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        username: newUser.username,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log("Error in signupUserFn: ", err.message);
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    // check user exist or not
    const user = await User.findOne({ username });
    // check entered password match with the user password or not
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );
    if (!user || !isPasswordCorrect)
      return res.status(400).json({ message: "Wrong email or password" });
    // generate token if user exist and password matching correct
    generateTokenAndSetCookie(user._id, res);
    // send user in response
    res.status(200).json({
      message: "Logged in successfully",
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log("Error in loginUserFn: ", err.message);
  }
};

const logoutUser = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 1 });
    res.status(200).json({ message: "User logged out successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log("Error in logoutUserFn: ", err.message);
  }
};

const followUnFollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userToModify = await User.findById(id); // the user we need to follow or unfollow
    const currentUser = await User.findById(req.user._id); // me or logged in user
    if (id === req.user._id.toString()) {
      return res
        .status(400)
        .json({ message: "You cannot follow or unfollow yourself😂" });
    }
    if (!userToModify || !currentUser)
      return res.status(404).json({ message: "User not found" });
    // get following list
    const isFollowing = currentUser.following.includes(id);
    if (isFollowing) {
      // unfollow user - current user following -1 and user to modify followers -1
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      res.status(200).json({
        message: `${currentUser.username} unfollowed ${userToModify.username} successfully`,
      });
    } else {
      // follow user - current user following +1 and user to modify followers +1
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      res.status(200).json({
        message: `${currentUser.username} followed ${userToModify.username} successfully`,
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log("Error in followUnFollowUserFn: ", err.message);
  }
};

const updateUser = async (req, res) => {
  const { name, email, username, password, profilePic, bio } = req.body;
  const userId = req.user._id;
  try {
    let user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (req.params.id !== userId.toString())
      return res
        .status(400)
        .json({ message: "You cannot update other user's profile 😊" });
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }
    user.name = name || user.name;
    user.username = username || user.username;
    user.email = email || user.email;
    user.profilePic = profilePic || user.profilePic;
    user.bio = bio || user.bio;
    user = await user.save();
    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log("Error in updateUserFn: ", err.message);
  }
};

export { signupUser, loginUser, logoutUser, followUnFollowUser, updateUser };
