import foodModel from "../models/foodModel.js";
import userModel from "../models/userModel.js";
import fs from "fs";

// add food items
const addFood = async (req, res) => {
  try {
    const image_filename = req.file ? req.file.filename : null;

    const food = new foodModel({
      name: req.body.name,
      description: req.body.description,
      price: Number(req.body.price),
      category: req.body.category,
      image: image_filename,
    });

    const userData = await userModel.findById(req.body.userId);
    if (!userData || userData.role !== "admin") {
      return res.status(403).json({ success: false, message: "You are not admin" });
    }

    await food.save();
    res.json({ success: true, message: "Food Added" });
  } catch (error) {
    console.error("Add food error:", error);
    res.status(500).json({ success: false, message: "Error adding food" });
  }
};

// all foods
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.error("List food error:", error);
    res.status(500).json({ success: false, message: "Error fetching food" });
  }
};

// remove food item
const removeFood = async (req, res) => {
  try {
    const userData = await userModel.findById(req.body.userId);
    if (!userData || userData.role !== "admin") {
      return res.status(403).json({ success: false, message: "You are not admin" });
    }

    const food = await foodModel.findById(req.body.id);
    if (!food) {
      return res.status(404).json({ success: false, message: "Food not found" });
    }

    if (food.image) {
      fs.unlink(`uploads/${food.image}`, (err) => {
        if (err) console.error("Failed to delete image:", err.message);
      });
    }

    await foodModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Food Removed" });
  } catch (error) {
    console.error("Remove food error:", error);
    res.status(500).json({ success: false, message: "Error removing food" });
  }
};

export { addFood, listFood, removeFood };
