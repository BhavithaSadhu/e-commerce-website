import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Event when successfully connected
    mongoose.connection.on("connected", () => {
      console.log("MongoDB Connected");
    });

    // Connect using correct ENV variable
    await mongoose.connect(process.env.MONGODB_URI);

  } catch (error) {
    console.error("MongoDB Error:", error);
    process.exit(1);
  }
};

export default connectDB;
