import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate } =
    useContext(ShopContext);

  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    if (products.length === 0) return;

    const temp = [];
    for (const id in cartItems) {
      for (const size in cartItems[id]) {
        if (cartItems[id][size] > 0) {
          temp.push({
            _id: id,
            size,
            quantity: cartItems[id][size],
          });
        }
      }
    }
    setCartData(temp);
  }, [cartItems, products]);

  return (
    <div className="border-t pt-14">
      <Title text1="YOUR" text2="CART" />

      {cartData.map((item, index) => {
        const product = products.find(p => p._id === item._id);
        if (!product) return null;

        return (
          <div
            key={index}
            className="pt-4 border-b text-gray-700 grid grid-cols-[4fr_1fr_0.5fr] gap-4"
          >
            <div className="flex gap-4">
              <img src={product.image[0]} className="w-16" />
              <div>
                <p className="font-medium">{product.name}</p>
                <p>{currency}{product.price}</p>
                <p className="text-sm">Size: {item.size}</p>
              </div>
            </div>

            <input
              type="number"
              min={1}
              defaultValue={item.quantity}
              onChange={(e) =>
                updateQuantity(item._id, item.size, Number(e.target.value))
              }
              className="border px-2"
            />

            <img
              src={assets.bin_icon}
              className="w-5 cursor-pointer"
              onClick={() => updateQuantity(item._id, item.size, 0)}
            />
          </div>
        );
      })}

      <div className="flex justify-end mt-10">
        <div className="w-[400px]">
          <CartTotal />
          <button
            onClick={() => navigate("/placeorder")}
            className="bg-black text-white w-full py-3 mt-5"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
