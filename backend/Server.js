import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mangodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/CartRoute.js";
import orderRouter from "./routes/Order.js";

// App config
const app = express();
const port = process.env.PORT || 5000;

// Connect to DB
connectDB();
connectCloudinary();


// Middlewares
app.use(express.json());
app.use(cors({
  origin: true, // allow requests from any origin (for dev). For production, set a specific origin.
  credentials: true,
  allowedHeaders: ['Content-Type', 'token', 'Authorization', 'Accept'],
  exposedHeaders: ['token', 'Authorization']
}));

// Endpoints
app.use('/api/user',userRouter);
app.use('/api/product',productRouter);
app.use('/api/cart',cartRouter);
app.use('/api/order',orderRouter);


app.get("/", (req, res) => {
  res.send("API WORKING");
});

// Start server
app.listen(port, () => {
  console.log("Server started on PORT:", port);
});
