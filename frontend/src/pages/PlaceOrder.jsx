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
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "E-Commerce Order",
      description: "Order Payment",
      order_id: order.id,
      handler: async (response) => {
        try {
          const verifyRes = await axios.post(
            backendUrl + "/api/order/verifyRazorpay",
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            },
            { headers: { token } }
          );

          if (verifyRes.data.success) {
            setCartItems({});
            navigate("/orders");
          } else {
            toast.error("Payment verification failed");
          }
        } catch {
          toast.error("Payment verification error");
        }
      },
      theme: { color: "#000000" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  /* ---------------- PLACE ORDER ---------------- */
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      let orderItems = [];

      for (const productId in cartItems) {
        for (const size in cartItems[productId]) {
          if (cartItems[productId][size] > 0) {
            const product = products.find(p => p._id === productId);
            if (product) {
              orderItems.push({
                _id: product._id,
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

      // ✅ COD
      if (method === "cod") {
        const res = await axios.post(
          backendUrl + "/api/order/place",
          orderData,
          { headers: { token } }
        );

        if (res.data.success) {
          setCartItems({});
          navigate("/orders");
        } else {
          toast.error(res.data.message);
        }
        return;
      }

      // ✅ RAZORPAY
      if (method === "razorpay") {
        const res = await axios.post(
          backendUrl + "/api/order/razorpay",
          orderData,
          { headers: { token } }
        );

        if (res.data.success) {
          initpay(res.data.order);
        } else {
          toast.error("Failed to create Razorpay order");
        }
      }

    } catch (error) {
      console.log(error);
      toast.error("Order failed");
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col sm:flex-row gap-6 pt-14 border-t"
    >
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <Title text1="DELIVERY" text2="INFORMATION" />

        <div className="flex gap-3">
          <input required name="firstName" onChange={onChangeHandles} className="border p-2 w-full" placeholder="First Name" />
          <input required name="lastName" onChange={onChangeHandles} className="border p-2 w-full" placeholder="Last Name" />
        </div>

        <input required name="email" onChange={onChangeHandles} className="border p-2" placeholder="Email" />
        <input required name="street" onChange={onChangeHandles} className="border p-2" placeholder="Street" />

        <div className="flex gap-3">
          <input required name="city" onChange={onChangeHandles} className="border p-2 w-full" placeholder="City" />
          <input required name="state" onChange={onChangeHandles} className="border p-2 w-full" placeholder="State" />
        </div>

        <div className="flex gap-3">
          <input required name="zipcode" onChange={onChangeHandles} className="border p-2 w-full" placeholder="Zip" />
          <input required name="country" onChange={onChangeHandles} className="border p-2 w-full" placeholder="Country" />
        </div>

        <input required name="phone" onChange={onChangeHandles} className="border p-2" placeholder="Phone" />
      </div>

      <div className="mt-10 w-full sm:max-w-[400px]">
        <CartTotal />

        <Title text1="PAYMENT" text2="METHOD" />

        <div onClick={() => setMethod("razorpay")} className="border p-3 cursor-pointer">
          <img src={assets.razorpay_logo} className="h-5" />
        </div>

        <div onClick={() => setMethod("cod")} className="border p-3 cursor-pointer mt-2">
          Cash On Delivery
        </div>

        <button type="submit" className="bg-black text-white w-full py-3 mt-6">
          Place Order
        </button>
      </div>
    </form>
  );
};

export default PlaceOrder;
