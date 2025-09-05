import express from "express";
const router = express.Router();

import authMiddleware from "../middleware/auth.js"; // adjust if different

// Example order route
router.post("/place", authMiddleware, async (req, res) => {
  try {
    res.json({ message: "Order placed successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
