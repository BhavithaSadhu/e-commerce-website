import orderModel from "../models/OrderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";
import Razorpay from "razorpay";
import crypto from "crypto";

const currency = "INR";

/* ---------------- COD ---------------- */
const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, amount, address } = req.body;

    let orderItems = [];

    for (const item of items) {
      const product = await productModel.findById(item._id);
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

    const newOrder = new orderModel({
      userId,
      items: orderItems,
      address,
      amount,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    });

    await newOrder.save();
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Order Placed" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/* ---------------- RAZORPAY ---------------- */
const placeOrderRazorpay = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, amount, address } = req.body;

    const razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    let orderItems = [];

    for (const item of items) {
      const product = await productModel.findById(item._id);
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

    const newOrder = await orderModel.create({
      userId,
      items: orderItems,
      address,
      amount,
      paymentMethod: "Razorpay",
      payment: false,
      date: Date.now(),
    });

    const razorOrder = await razorpayInstance.orders.create({
      amount: amount * 100,
      currency,
      receipt: newOrder._id.toString(),
    });

    res.json({ success: true, order: razorOrder });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/* ---------------- VERIFY RAZORPAY ---------------- */
const verifyRazorpay = async (req, res) => {
  try {
    const userId = req.user.id;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.json({ success: false, message: "Invalid Signature" });
    }

    await orderModel.findOneAndUpdate(
      { paymentMethod: "Razorpay", payment: false },
      { payment: true }
    );

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Payment Successful" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/* ---------------- ADMIN ---------------- */
const allOrders = async (req, res) => {
  const orders = await orderModel.find({});
  res.json({ success: true, orders });
};

const userOrders = async (req, res) => {
  const userId = req.user.id;
  const orders = await orderModel.find({ userId });
  res.json({ success: true, orders });
};

const updateStatus = async (req, res) => {
  const { orderId, status } = req.body;
  await orderModel.findByIdAndUpdate(orderId, { status });
  res.json({ success: true, message: "Status Updated" });
};

export {
  placeOrder,
  placeOrderRazorpay,
  verifyRazorpay,
  allOrders,
  userOrders,
  updateStatus,
};
