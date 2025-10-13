import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const connectDB = async (uri: string) => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || uri);
        console.log("MongoDB connected", conn.connection.host);
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
}