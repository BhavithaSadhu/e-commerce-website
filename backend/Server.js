import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mangodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";

// App config
const app = express();
const port = process.env.PORT || 5000;

// Connect to DB
connectDB();
connectCloudinary();


// Middlewares
app.use(express.json());
app.use(cors());

// Endpoints
app.use('/api/user',userRouter)
app.use('/api/product',productRouter);


app.get("/", (req, res) => {
  res.send("API WORKING");
});

// Start server
app.listen(port, () => {
  console.log("Server started on PORT:", port);
});
