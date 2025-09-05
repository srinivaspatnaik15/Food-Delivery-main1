import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  placeOrder,
  userOrders,
  listOrders,
  updateStatus,
} from "../controllers/orderController.js";

const router = express.Router();

// Place an order (user)
router.post("/place", authMiddleware, placeOrder);

// Get user orders
router.post("/userorders", authMiddleware, userOrders);

// Get all orders (admin only)
router.post("/list", authMiddleware, listOrders);

// Update order status (admin only)
router.post("/status", authMiddleware, updateStatus);

export default router;
