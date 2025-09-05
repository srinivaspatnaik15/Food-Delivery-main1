import express from "express";
import Food from "../models/foodModel.js";  // Make sure this model exists

const router = express.Router();

// GET all foods (for /api/food/)
router.get("/", async (req, res) => {
  try {
    const foods = await Food.find();
    res.json({ success: true, data: foods });
  } catch (error) {
    console.error("❌ Food route error:", error.message);
    res.status(500).json({ success: false, error: "Server error: " + error.message });
  }
});

// GET all foods (for /api/food/list)
router.get("/list", async (req, res) => {
  try {
    const foods = await Food.find();
    res.json({ success: true, data: foods });
  } catch (error) {
    console.error("❌ Food route error:", error.message);
    res.status(500).json({ success: false, error: "Server error: " + error.message });
  }
});

// Add a new food (for admin use, optional)
router.post("/", async (req, res) => {
  try {
    const newFood = new Food(req.body);
    await newFood.save();
    res.status(201).json({ success: true, data: newFood });
  } catch (error) {
    console.error("❌ Error adding food:", error.message);
    res.status(500).json({ success: false, error: "Server error: " + error.message });
  }
});

export default router;