import mongoose from "mongoose";
import { ENV } from "./env";

export const connectDB = async (uri: string) => {
    try {
        const conn = await mongoose.connect(ENV.MONGO_URI || uri);
        console.log("MongoDB connected", conn.connection.host);
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
}