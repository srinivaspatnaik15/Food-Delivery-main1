import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

// placing user order for frontend
const placeOrder = async (req, res) => {
  try {
    // fallback userId if not provided
    const userId = req.body.userId || "guest";

    if (!req.body.items || req.body.items.length === 0) {
      return res.json({ success: false, message: "No items in order" });
    }

    const newOrder = new orderModel({
      userId,                                   // ✅ always set userId
      items: req.body.items,
      amount: req.body.amount || 0,
      address: req.body.address || {},
      paymentMethod: req.body.paymentMethod || "COD",
      payment: true,
    });

    await newOrder.save();

    return res.json({
      success: true,
      message: "Order placed successfully",
      order: newOrder, // ✅ return saved order to frontend
    });
  } catch (error) {
    console.error("❌ Error placing order:", error);
    return res.json({ success: false, message: "Error placing order" });
  }
};

// user orders for frontend
const userOrders = async (req, res) => {
  try {
    const userId = req.body.userId || "guest";
    const orders = await orderModel.find({ userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    res.json({ success: false, message: "Error fetching orders" });
  }
};

// Listing orders for admin panel
const listOrders = async (req, res) => {
  try {
    const userData = await userModel.findById(req.body.userId);
    if (userData && userData.role === "admin") {
      const orders = await orderModel.find({});
      res.json({ success: true, data: orders });
    } else {
      res.json({ success: false, message: "You are not admin" });
    }
  } catch (error) {
    console.error("❌ Error listing orders:", error);
    res.json({ success: false, message: "Error" });
  }
};

// api for updating status
const updateStatus = async (req, res) => {
  try {
    const userData = await userModel.findById(req.body.userId);
    if (userData && userData.role === "admin") {
      await orderModel.findByIdAndUpdate(req.body.orderId, {
        status: req.body.status,
      });
      res.json({ success: true, message: "Status Updated Successfully" });
    } else {
      res.json({ success: false, message: "You are not an admin" });
    }
  } catch (error) {
    console.error("❌ Error updating status:", error);
    res.json({ success: false, message: "Error" });
  }
};

export { placeOrder, userOrders, listOrders, updateStatus };
