console.log("🔥 NEW ORDER CONTROLLER LOADED 🔥");

import Order from "../models/OrderModel.js";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import Razorpay from "razorpay";
import crypto from "crypto";

const currency = "INR";

/* ---------------- COD ---------------- */
export const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, amount, address } = req.body;

    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item._id);
      if (!product) continue;

      orderItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        size: item.size,
        image: product.image,
      });
    }

    const order = await Order.create({
      userId,
      items: orderItems,
      address,
      amount,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    });

    await User.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ---------------- RAZORPAY ---------------- */
export const placeOrderRazorpay = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, amount, address } = req.body;

    // 🔥 INIT RAZORPAY ONLY HERE
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const orderItems = [];
    for (const item of items) {
      const product = await Product.findById(item._id);
      if (!product) continue;

      orderItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        size: item.size,
        image: product.image,
      });
    }

    const newOrder = await Order.create({
      userId,
      items: orderItems,
      address,
      amount,
      paymentMethod: "Razorpay",
      payment: false,
      date: Date.now(),
    });

    const razorOrder = await razorpay.orders.create({
      amount: amount * 100,
      currency,
      receipt: newOrder._id.toString(),
    });

    res.json({ success: true, order: razorOrder });
  } catch (error) {
    console.error("Razorpay error:", error);
    res.status(500).json({ success: false, message: "Failed to create Razorpay order" });
  }
};

/* ---------------- VERIFY RAZORPAY ---------------- */
export const verifyRazorpay = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.json({ success: false, message: "Invalid signature" });
    }

    await Order.findByIdAndUpdate(req.body.receipt, { payment: true });
    await User.findByIdAndUpdate(req.user.id, { cartData: {} });

    res.json({ success: true, message: "Payment verified" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
