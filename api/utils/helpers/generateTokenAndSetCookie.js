import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });
  res.cookie("jwt", token, {
    httpOnly: true, // this cookie cannot be accessed by the browser and this make it more secure
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    sameSite: "strict", // this is for CSRF attack (more protection from attackers)
  });
  return token; // return token in case we use it
};

export default generateTokenAndSetCookie;
