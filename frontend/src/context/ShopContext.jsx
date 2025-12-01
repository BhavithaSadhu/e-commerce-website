import React, { useState, createContext, useEffect } from "react";
import { products } from "../assets/assets";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "Rs.";
  const delivery_fee = 45;

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(true);
  const [cartItems, setCartItems] = useState({}); 
  const navigate = useNavigate()

  // Add to cart
  const addToCart = (itemId, size) => {
    if (!size) {
      toast.error("Select product size");
      return;
    }

    let cartData = JSON.parse(JSON.stringify(cartItems)); // safer clone

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }

    setCartItems(cartData);
  };

  // Total count of all items in cart
  const getCartCount = () => {
    let totalCount = 0;

    for (const id in cartItems) {
      for (const size in cartItems[id]) {
        try {
          if (cartItems[id][size] > 0) {
            totalCount += cartItems[id][size];
          }
        } catch (error) {
          console.error(error);
        }
      }
    }
    return totalCount;
  };

  const updateQuantity = async(itemId,size,quantity)=>{
    let cartData= structuredClone(cartItems);
    cartData[itemId][size]=quantity;
    setCartItems(cartData);

  }

  const getCartAmount = ()=>{
     let ta=0;
     for(const items in cartItems)
     {
      let itemInfo=products.find((product)=> product._id === items);
      for(const item in cartItems[items] )
      {
        try{
          if(cartItems[items][item]>0)
          {
            ta+=itemInfo.price * cartItems[items][item];
          }
        }
        catch(error)
        {

        }
      }
     }
     return ta;
  }
  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,navigate
    
  };

  return <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>;
};

export default ShopContextProvider;
