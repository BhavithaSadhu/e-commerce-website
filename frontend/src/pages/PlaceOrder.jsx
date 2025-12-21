import React, { useContext, useState } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import axios from "axios";

const PlaceOrder = () => {
  const {
    navigate,
    backendUrl,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    products,
  } = useContext(ShopContext);

  const [method, setMethod] = useState("cod");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const onChangeHandles = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* ---------------- RAZORPAY INIT ---------------- */
  const initpay = (order) => {
    if (!window.Razorpay) {
      toast.error("Razorpay SDK not loaded");
      return;
    }

    const key = import.meta.env.VITE_RAZORPAY_KEY_ID;
    if (!key) {
      toast.error("Razorpay key missing");
      return;
    }

    const options = {
      key,
      amount: order.amount,
      currency: order.currency,
      name: "Order Payment",
      description: "Order Payment",
      order_id: order.id,
      handler: async (response) => {
        try {
          const { data } = await axios.post(
            backendUrl + "/api/order/verifyRazorpay",
            response,
            { headers: { token } }
          );

          if (data.success) {
            setCartItems({});
            navigate("/orders");
          } else {
            toast.error("Payment verification failed");
          }
        } catch (error) {
          toast.error("Payment verification error");
        }
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  /* ---------------- PLACE ORDER ---------------- */
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    /* 🚫 BLOCK EMPTY CART */
    if (!cartItems || Object.keys(cartItems).length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (getCartAmount() === 0) {
      toast.error("Your cart amount is zero");
      return;
    }

    try {
      let orderItems = [];

      for (const productId in cartItems) {
        for (const size in cartItems[productId]) {
          if (cartItems[productId][size] > 0) {
            const product = products.find(p => p._id === productId);
            if (product) {
              orderItems.push({
                ...product,
                size,
                quantity: cartItems[productId][size],
              });
            }
          }
        }
      }

      const orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
      };

      /* ---------------- COD ---------------- */
      if (method === "cod") {
        const response = await axios.post(
          backendUrl + "/api/order/place",
          orderData,
          { headers: { token } }
        );

        if (response.data.success) {
          setCartItems({});
          navigate("/orders");
        } else {
          toast.error(response.data.message);
        }
        return; // ⛔ VERY IMPORTANT
      }

      /* ---------------- RAZORPAY ---------------- */
      if (method === "razorpay") {
        const response = await axios.post(
          backendUrl + "/api/order/razorpay",
          orderData,
          { headers: { token } }
        );

        if (response.data.success) {
          initpay(response.data.order);
        } else {
          toast.error("Failed to create Razorpay order");
        }
        return;
      }

    } catch (error) {
      console.log(error);
      toast.error("Order submission failed");
    }
  };

  return (
    <form
      className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t"
      onSubmit={onSubmitHandler}
    >
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <Title text1="DELIVERY" text2="INFORMATION" />

        <div className="flex gap-3">
          <input required name="firstName" onChange={onChangeHandles} className="border px-3 py-2 w-full" placeholder="First Name" />
          <input required name="lastName" onChange={onChangeHandles} className="border px-3 py-2 w-full" placeholder="Last Name" />
        </div>

        <input required name="email" onChange={onChangeHandles} className="border px-3 py-2 w-full" placeholder="Email" />
        <input required name="street" onChange={onChangeHandles} className="border px-3 py-2 w-full" placeholder="Street" />

        <div className="flex gap-3">
          <input required name="city" onChange={onChangeHandles} className="border px-3 py-2 w-full" placeholder="City" />
          <input required name="state" onChange={onChangeHandles} className="border px-3 py-2 w-full" placeholder="State" />
        </div>

        <div className="flex gap-3">
          <input required name="zipcode" onChange={onChangeHandles} className="border px-3 py-2 w-full" placeholder="Zip" />
          <input required name="country" onChange={onChangeHandles} className="border px-3 py-2 w-full" placeholder="Country" />
        </div>

        <input required name="phone" onChange={onChangeHandles} className="border px-3 py-2 w-full" placeholder="Phone" />
      </div>

      <div className="mt-8">
        <CartTotal />

        <div className="mt-10">
          <Title text1="PAYMENT" text2="METHOD" />

          <div onClick={() => setMethod("stripe")} className="border p-2 cursor-pointer">
            <img src={assets.stripe_logo} className="h-5" />
          </div>

          <div onClick={() => setMethod("razorpay")} className="border p-2 cursor-pointer">
            <img src={assets.razorpay_logo} className="h-5" />
          </div>

          <div onClick={() => setMethod("cod")} className="border p-2 cursor-pointer">
            Cash On Delivery
          </div>
        </div>

        <button type="submit" className="bg-black text-white px-16 py-3 mt-8">
          Place Order
        </button>
      </div>
    </form>
  );
};

export default PlaceOrder;
