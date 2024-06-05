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
    console.log("Error in loginUserFn: ", err.message);
  }
};

export { signupUser, loginUser, logoutUser };
