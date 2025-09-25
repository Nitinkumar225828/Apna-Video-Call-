import httpStatus from "http-status";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { User } from "../models/usersModel.js";
import { Meeting } from "../models/meetingModul.js";

/**
 * User login: validates credentials and returns a session token.
 */
export const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: "Username and password are required" });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "Invalid username or password" });
    }

    const token = crypto.randomBytes(64).toString("hex");
    user.token = token;
    await user.save();

    return res
      .status(httpStatus.OK)
      .json({ message: "Login successful", token });
  } catch (err) {
    console.error("Login error:", err);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: `Something went wrong: ${err.message}` });
  }
};

/**
 * Register a new user.
 */
export const register = async (req, res) => {
  const { name, username, password } = req.body;

  if (!name || !username || !password) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: "Name, username and password are required" });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res
        .status(httpStatus.CONFLICT)
        .json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      username,
      password: hashedPassword,
    });

    await newUser.save();
    return res
      .status(httpStatus.CREATED)
      .json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Register error:", err);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: `Something went wrong: ${err.message}` });
  }
};

/**
 * Get all meeting history for a user token.
 */
export const getUserHistory = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: "Token is required" });
  }

  try {
    const user = await User.findOne({ token });
    if (!user) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "Invalid token or user not found" });
    }

    const meetings = await Meeting.find({ user_id: user.username });
    return res.status(httpStatus.OK).json(meetings);
  } catch (err) {
    console.error("GetUserHistory error:", err);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: `Something went wrong: ${err.message}` });
  }
};

/**
 * Add a meeting to user's history.
 */
export const addToHistory = async (req, res) => {
  const { token, meeting_code } = req.body;

  if (!token || !meeting_code) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: "Token and meeting_code are required" });
  }

  try {
    const user = await User.findOne({ token });
    if (!user) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "Invalid token or user not found" });
    }

    const newMeeting = new Meeting({
      user_id: user.username,
      meetingCode: meeting_code,
    });

    await newMeeting.save();

    return res
      .status(httpStatus.CREATED)
      .json({ message: "Meeting added to history" });
  } catch (err) {
    console.error("AddToHistory error:", err);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: `Something went wrong: ${err.message}` });
  }
};
