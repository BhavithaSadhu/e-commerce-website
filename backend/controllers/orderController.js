import orderModel from "../models/OrderModel.js"
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";
import razorpay from 'razorpay'
//using cod

const currency='inr'
const deliveryCharge=10

const razorpayInstance = new razorpay({
  key_id:process.env.RAZORPAY_KEY_ID,
  key_secret : process.env.RAZORPAY_KEY_SECRET,
})
const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

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
        image: product.image   // ✅ IMAGE STORED HERE
      });
    }

    const orderData = {
      userId,
      items: orderItems,
      address,
      amount,
      paymentMethod: "COD",
      payment: false,
      date: Date.now()
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Order Placed" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//using razor pay
const placeOrderStripe = async(req,res) =>{
  

}

//using stripe pay
const placeOrderRazorpay = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    // 🔥 BUILD ITEMS (SAME AS COD)
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

    // 🔥 SAVE ITEMS IN DB
    const newOrder = new orderModel({
      userId,
      items: orderItems,        // ✅ THIS WAS MISSING
      address,
      amount,
      paymentMethod: "Razorpay",
      payment: false,
      date: Date.now(),
    });

    await newOrder.save();

    // 🔥 CREATE RAZORPAY ORDER
    const options = {
      amount: amount * 100,
      currency: currency.toUpperCase(),
      receipt: newOrder._id.toString(),
    };

    const razorOrder = await razorpayInstance.orders.create(options);

    res.json({ success: true, order: razorOrder });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


const verifyRazorpay = async(req,res)=>{
  try {
    const {razorpay_order_id, userId} = req.body;
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
    if(orderInfo.status === 'paid'){
      await orderModel.findByIdAndUpdate(orderInfo.receipt,{payment:true});
      
      await userModel.findByIdAndUpdate(userId,{cartData:{}})
      res.json({success:true,message:"Payment Successful"})
    }else{
      res.json({success:false,message:"Payment Failed"})
    }
  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
    
  }

}

// all orders for admin panel

//using razor pay
const allOrders = async(req,res) =>{
  try {
    const orders = await orderModel.find({})
    res.json({success:true,orders})  
    
  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
    
  }

}

//user order data for front end
//using razor pay
const userOrders = async(req,res) =>{
    try {

        const {userId} = req.body;


        const orders = await orderModel.find({userId})
        res.json({success:true,orders})

        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
        
    }

} 


//update status from admin panel

const updateStatus = async(req,res) =>{
  try {
    const {orderId,status} = req.body
    await orderModel.findByIdAndUpdate(orderId,{status})
    res.json({success:true,message:"Status Updated"})
  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
    
  }

}

export {verifyRazorpay,placeOrder,placeOrderRazorpay,placeOrderStripe,allOrders,userOrders,updateStatus}