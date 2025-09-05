import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    items: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        foodId: { type: mongoose.Schema.Types.ObjectId, ref: "food" },
      },
    ],
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, default: "Food Processing" },
    date: { type: Date, default: Date.now()}, // ✅ fixed
    payment: { type: Boolean, default: false },
  });

const orderModel =
  mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;
