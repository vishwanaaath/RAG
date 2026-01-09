import express from "express";
import { User } from "../models/User.js";

const router = express.Router();

/**
 * GET /api/users/:auth0Id
 * Check if user exists
 */
router.get("/:auth0Id", async (req, res) => {
  try {
    const user = await User.findOne({
      auth0Id: req.params.auth0Id,
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * POST /api/users
 * Create new user
 */
router.post("/", async (req, res) => {
  try {
    const { auth0Id, name, email, picture } = req.body;

    const existingUser = await User.findOne({ auth0Id });
    if (existingUser) {
      return res.json(existingUser);
    }

    const user = await User.create({
      auth0Id,
      name,
      email,
      picture,
    });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to create user" });
  }
});

export default router;
