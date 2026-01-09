import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true,
      index: true, // 🔥 important for fast user-based queries
    },

    question: {
      type: String,
      required: true,
    },

    answer: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Conversation = mongoose.model("Conversation", conversationSchema);
