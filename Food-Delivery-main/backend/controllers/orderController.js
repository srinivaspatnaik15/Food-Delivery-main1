import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

// placing user order
const placeOrder = async (req, res) => {
  try {
    const userId = req.userId || null; // ✅ safer, set via authMiddleware

    if (!req.body.items || req.body.items.length === 0) {
      return res.status(400).json({ success: false, message: "No items in order" });
    }

    const newOrder = new orderModel({
      userId,
      items: req.body.items,
      amount: Number(req.body.amount) || 0,
      address: req.body.address || {},
      paymentMethod: req.body.paymentMethod || "COD",
      payment: req.body.paymentMethod === "COD" ? false : true,
    });

    await newOrder.save();

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("❌ Error placing order:", error);
    return res.status(500).json({ success: false, message: "Error placing order" });
  }
};

// user orders
const userOrders = async (req, res) => {
  try {
    const userId = req.userId; // ✅ from middleware
    const orders = await orderModel.find({ userId }).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    res.status(500).json({ success: false, message: "Error fetching orders" });
  }
};

// admin: list all orders
const listOrders = async (req, res) => {
  try {
    const userData = await userModel.findById(req.userId);
    if (!userData || userData.role !== "admin") {
      return res.status(403).json({ success: false, message: "You are not admin" });
    }

    const orders = await orderModel.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error("❌ Error listing orders:", error);
    res.status(500).json({ success: false, message: "Error listing orders" });
  }
};

// admin: update order status
const updateStatus = async (req, res) => {
  try {
    const userData = await userModel.findById(req.userId);
    if (!userData || userData.role !== "admin") {
      return res.status(403).json({ success: false, message: "You are not an admin" });
    }

    const updated = await orderModel.findByIdAndUpdate(
      req.body.orderId,
      { status: req.body.status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, message: "Status Updated Successfully", order: updated });
  } catch (error) {
    console.error("❌ Error updating status:", error);
    res.status(500).json({ success: false, message: "Error updating status" });
  }
};

export { placeOrder, userOrders, listOrders, updateStatus };
