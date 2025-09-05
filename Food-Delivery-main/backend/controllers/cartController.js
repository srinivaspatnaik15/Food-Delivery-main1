import userModel from "../models/userModel.js";

// Add item to user cart
const addToCart = async (req, res) => {
  try {
    const { userId, itemId } = req.body;
    let userData = await userModel.findById(userId);
    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }
    let cartData = userData.cartData || {}; // Defensive: default to empty object

    if (!cartData[itemId]) {
      cartData[itemId] = 1;
    } else {
      cartData[itemId] += 1;
    }

    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Added to Cart", cartData });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.json({ success: false, message: "Error adding to cart" });
  }
};

// Remove item from user cart
const removeFromCart = async (req, res) => {
  try {
    const { userId, itemId } = req.body;
    let userData = await userModel.findById(userId);
    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }
    let cartData = userData.cartData || {};

    if (cartData[itemId] > 1) {
      cartData[itemId] -= 1;
    } else if (cartData[itemId]) {
      delete cartData[itemId];
    } // else, nothing to remove

    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Removed from Cart", cartData });
  } catch (error) {
    console.error("Remove from cart error:", error);
    res.json({ success: false, message: "Error removing from cart" });
  }
};

// Fetch user cart data
const getCart = async (req, res) => {
  try {
    const { userId } = req.body;
    let userData = await userModel.findById(userId);
    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }
    let cartData = userData.cartData || {};
    res.json({ success: true, cartData });
  } catch (error) {
    console.error("Get cart error:", error);
    res.json({ success: false, message: "Error fetching cart" });
  }
};

export { addToCart, removeFromCart, getCart };