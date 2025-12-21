import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";

const CartTotal = () => {
  const { currency, delivery_fee, getCartAmount } =
    useContext(ShopContext);

  const subtotal = getCartAmount();
  const total = subtotal === 0 ? 0 : subtotal + delivery_fee;

  return (
    <div>
      <Title text1="CART" text2="TOTAL" />

      <div className="text-sm mt-4 space-y-2">
        <div className="flex justify-between">
          <p>Sub Total</p>
          <p>{currency}{subtotal}</p>
        </div>

        <div className="flex justify-between">
          <p>Shipping</p>
          <p>{currency}{delivery_fee}</p>
        </div>

        <div className="flex justify-between font-bold">
          <p>Total</p>
          <p>{currency}{total}</p>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
