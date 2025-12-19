import React, { useState, createContext, useEffect } from "react";
import axios from 'axios';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react-refresh/only-export-components
export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "Rs.";
  const delivery_fee = 45;
  
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  


  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(true);
  const [cartItems, setCartItems] = useState({}); 

  const [products,setProducts] = useState([]);

  const [token,setToken] = useState('');
  const navigate = useNavigate()

  // Add to cart
  const addToCart = async (itemId, size) => {
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

    if(token)
    {
      try {
        await axios.post(backendUrl + '/api/cart/add',{itemId,size},{headers:{token}})
        
      } catch (error) {
        console.log(error)
        toast.error(error.message)
        
      }
    }
  };

  // Total count of all items in cart
  const getCartCount =  () => {
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

    if(token)
    {
      try {
        await axios.post(backendUrl + '/api/cart/update',{itemId,size,quantity}, {headers:{token}})
        
      } catch (error) {
        console.log(error)
        toast.error(error.message)
        
      }
    }



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
        // eslint-disable-next-line no-unused-vars
        catch(error)
        { /* empty */ }
      }
     }
     return ta;
  }

  const getProductsData = async ()=>{
    try {
      const response = await axios.get(backendUrl + "/api/product/list")
      if(response.data.success){
        setProducts(response.data.products)
      }
      else{
        toast.error(response.data.message)
      }
      
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }
  const getUserCart = async (token) => {
    try {
      const response = await axios.post(backendUrl + '/api/cart/get',{},{headers:{token}})
      if(response.data.success)
      {
        setCartItems(response.data.cartData)
      }
    
    } catch (error) {
      console.log(error)
      toast.error(error.message)
      
    }

  }

  useEffect(
    ()=>{
      // eslint-disable-next-line react-hooks/set-state-in-effect
      getProductsData()
    },[]
  )
  useEffect(()=>{
    if(!token && localStorage.getItem('token'))
    {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setToken(localStorage.getItem('token'))
      getUserCart(localStorage.getItem('token'))
    }
  },[])

  

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    setCartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,navigate,
    backendUrl,
    setToken,
    token
    
  };

  return <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>;
};

export default ShopContextProvider;
