import express from "express";
import foodModel from "../models/foodModel.js"; // use the same name as your export

const router = express.Router();

// ✅ GET all foods (for /api/food or /api/food/list)
router.get("/", async (req, res) => {
  try {
    const foods = await foodModel.find();
    res.json({ success: true, data: foods });
  } catch (error) {
    console.error("❌ Food route error:", error.message);
    res.status(500).json({ success: false, error: "Server error: " + error.message });
  }
});

// ✅ Alias route for /api/food/list (same result)
router.get("/list", async (req, res) => {
  try {
    const foods = await foodModel.find();
    res.json({ success: true, data: foods });
  } catch (error) {
    console.error("❌ Food route error:", error.message);
    res.status(500).json({ success: false, error: "Server error: " + error.message });
  }
});

// ✅ Add a new food (only for admin)
router.post("/", async (req, res) => {
  try {
    const { name, description, price, category, image } = req.body;

    // basic validation
    if (!name || !description || !price || !category || !image) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const newFood = new foodModel(req.body);
    await newFood.save();

    res.status(201).json({ success: true, data: newFood });
  } catch (error) {
    console.error("❌ Error adding food:", error.message);
    res.status(500).json({ success: false, error: "Server error: " + error.message });
  }
});

export default router;
