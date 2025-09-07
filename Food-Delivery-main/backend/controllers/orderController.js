import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

// ✅ Place Order
const placeOrder = async (req, res) => {
  try {
    const newOrder = new orderModel({
      userId: req.userId,  // <-- from token
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
      payment: true,   // mark as paid since no Stripe
      status: "pending"
    });

    await newOrder.save();

    // clear user cart
    await userModel.findByIdAndUpdate(req.userId, { cartData: {} });

    res.json({ success: true, message: "Order placed successfully", order: newOrder });
  } catch (error) {
    console.error("Order placement error:", error);
    res.json({ success: false, message: "Error placing order" });
  }
};

// ✅ Get user orders
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error("User orders fetch error:", error);
    res.json({ success: false, message: "Error fetching orders" });
  }
};

// ✅ Admin – list all orders
const listOrders = async (req, res) => {
  try {
    const userData = await userModel.findById(req.userId); // <-- from token
    if (userData && userData.role === "admin") {
      const orders = await orderModel.find({}).sort({ createdAt: -1 });
      res.json({ success: true, data: orders });
    } else {
      res.json({ success: false, message: "You are not admin" });
    }
  } catch (error) {
    console.error("Admin list orders error:", error);
    res.json({ success: false, message: "Error listing orders" });
  }
};

// ✅ Admin – update status (no change needed)
const updateStatus = async (req, res) => {
  try {
    const userData = await userModel.findById(req.userId);
    if (userData && userData.role === "admin") {
      await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
      res.json({ success: true, message: "Status Updated Successfully" });
    } else {
      res.json({ success: false, message: "You are not an admin" });
    }
  } catch (error) {
    console.error("Update status error:", error);
    res.json({ success: false, message: "Error updating status" });
  }
};

export { placeOrder, userOrders, listOrders, updateStatus };
