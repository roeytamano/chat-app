import express from 'express';
import path from 'path';
import authRoutes from './routes/auth.route';
import messageRoutes from './routes/message.route';
import 'dotenv/config';
const app = express();
const port = parseInt(process.env.PORT || '3000', 10);
if (isNaN(port) || port < 1 || port > 65535) {
  throw new Error(`Invalid port: ${process.env.PORT}`);
}
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// make ready for deployment
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../frontend/dist")));

  app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
  });
}
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});