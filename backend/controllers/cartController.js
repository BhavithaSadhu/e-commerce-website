import userModel from "../models/userModel.js";

/* ---------------- ADD TO CART ---------------- */
const addToCart = async (req, res) => {
  try {
    const { userId, itemId, size } = req.body;

    const userData = await userModel.findById(userId);

    // ✅ HARD GUARD
    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    // ✅ INIT CART IF MISSING
    let cartData = userData.cartData || {};

    if (!cartData[itemId]) {
      cartData[itemId] = {};
    }

    cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;

    await userModel.findByIdAndUpdate(userId, { cartData });

    res.json({ success: true, message: "Added to cart", cartData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

/* ---------------- UPDATE CART ---------------- */
const updateCart = async (req, res) => {
  try {
    const { userId, itemId, size, quantity } = req.body;

    const userData = await userModel.findById(userId);

    // ✅ HARD GUARD
    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    let cartData = userData.cartData || {};

    if (!cartData[itemId]) {
      cartData[itemId] = {};
    }

    cartData[itemId][size] = quantity;

    await userModel.findByIdAndUpdate(userId, { cartData });

    res.json({ success: true, message: "Cart updated", cartData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

/* ---------------- GET CART ---------------- */
const getCart = async (req, res) => {
  try {
    const { userId } = req.body;

    const userData = await userModel.findById(userId);

    // ✅ RETURN EMPTY CART SAFELY
    if (!userData) {
      return res.json({ success: true, cartData: {} });
    }

    res.json({
      success: true,
      cartData: userData.cartData || {},
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { addToCart, updateCart, getCart };
