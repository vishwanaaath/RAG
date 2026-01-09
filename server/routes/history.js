import express from "express";
import { Conversation } from "../models/Conversation.js";

const router = express.Router();

/**
 * GET /api/history?email=
 * Returns list of past questions (user-specific)
 */
router.get("/", async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const history = await Conversation.find({ userEmail: email })
      .sort({ createdAt: -1 })
      .limit(50)
      .select("question createdAt");

    res.json(history);
  } catch (err) {
    console.error("❌ History error:", err);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

/**
 * GET /api/history/:id?email=
 * Returns full conversation (secure, user-owned)
 */
router.get("/:id", async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const convo = await Conversation.findOne({
      _id: req.params.id,
      userEmail: email, // 🔐 ownership check
    });

    if (!convo) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    res.json({
      question: convo.question,
      answer: convo.answer,
      createdAt: convo.createdAt,
    });
  } catch (err) {
    console.error("❌ History by ID error:", err);
    res.status(500).json({ error: "Failed to fetch conversation" });
  }
});

export default router;
