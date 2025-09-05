router.post("/place", authMiddleware, async (req, res) => {
  try {
    const { address, items, amount, paymentMethod } = req.body;

    const newOrder = new Order({
      userId: req.userId,   // ✅ comes from middleware
      address,
      items,
      amount,
      paymentMethod,
      status: "pending",
    });

    await newOrder.save();

    res.json({ success: true, message: "Order placed successfully", order: newOrder });
  } catch (error) {
    res.json({ success: false, message: "Failed to place order" });
  }
});
