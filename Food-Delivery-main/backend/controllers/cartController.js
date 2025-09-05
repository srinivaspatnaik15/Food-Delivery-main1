import userModel from "../models/userModel.js";

const addToCart = async (itemId) => {
  try {
    const res = await axios.post(`${url}/api/cart/add`, {
      userId: user._id, // make sure user is defined
      itemId,
    });
    if (res.data.success) {
      setCartItems(res.data.cartData);
    }
  } catch (err) {
    console.error("Add to cart failed:", err);
  }
};

const removeFromCart = async (itemId) => {
  try {
    const res = await axios.post(`${url}/api/cart/remove`, {
      userId: user._id,
      itemId,
    });
    if (res.data.success) {
      setCartItems(res.data.cartData);
    }
  } catch (err) {
    console.error("Remove from cart failed:", err);
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