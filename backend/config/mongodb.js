import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

    if (!uri) {
      throw new Error(
        "MONGODB_URI / MONGO_URI is not defined in environment variables"
      );
    }

    mongoose.connection.on("connected", () => {
        console.log("MongoDB connected successfully");
    });

    await mongoose.connect(uri);
  } catch (error) {
    console.error("DB Connection Error:", error.message);
    process.exit(1);
}
};

export default connectDB;


