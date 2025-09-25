import express from "express";
import {
  login,
  register,
  getUserHistory,
  addToHistory,
} from "../controllers/userController.js";

const router = express.Router();

/**
 * @route   POST /api/v1/users/register
 * @desc    Register a new user
 */
router.post("/register", register);

/**
 * @route   POST /api/v1/users/login
 * @desc    Login user and return token
 */
router.post("/login", login);

/**
 * @route   GET /api/v1/users/history
 * @desc    Get user's meeting history
 * @query   token
 */
router.get("/history", getUserHistory);

/**
 * @route   POST /api/v1/users/history
 * @desc    Add a meeting to user's history
 * @body    { token, meeting_code }
 */
router.post("/history", addToHistory);

export default router;
