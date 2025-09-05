import express from "express";
import Food from "../models/foodModel.js";  // make sure you have this model

const router = express.Router();

// ✅ GET all foods
router.get("/", async (req, res) => {
  try {
    const foods = await Food.find();
    res.json(foods);
  } catch (error) {
    console.error("❌ Food route error:", error.message);
    res.status(500).json({ error: "Server error: " + error.message });
  }
});

// ✅ Add a new food (for admin use, optional)
router.post("/", async (req, res) => {
  try {
    const newFood = new Food(req.body);
    await newFood.save();
    res.status(201).json(newFood);
  } catch (error) {
    console.error("❌ Error adding food:", error.message);
    res.status(500).json({ error: "Server error: " + error.message });
  }
});

export default router;
