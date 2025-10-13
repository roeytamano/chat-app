import express from 'express';
import path from 'path';
import authRoutes from './routes/auth.route';
import messageRoutes from './routes/message.route';
import 'dotenv/config';
import { connectDB } from './lib/db';

// create express app
const app = express();
const port = parseInt(process.env.PORT || '3000', 10);
if (isNaN(port) || port < 1 || port > 65535) {
  throw new Error(`Invalid port: ${process.env.PORT}`);
}

// middleware
app.use(express.json()); // request body parser
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// make ready for deployment
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../frontend/dist")));

  app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
  });
}

// start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error("MONGO_URI environment variable is not defined.");
  }
  connectDB(mongoUri);
});