import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/userRoutes.js";

const app = express();
dotenv.config();
connectDB();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // to parse JSON data in the req.body
app.use(
  express.urlencoded({
    // to parse JSON data in the req.body
    extended: true, // extended: true => even if the req.body has come nested objects it is gonna be able to parse that without any problems
  })
);
app.use(cookieParser()); // allow us to get the cookie from the request and set the cookie inside the response

// Routes
app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  console.log("API Working...");
});
