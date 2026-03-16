import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import surpriseRoutes from "./routes/surpriseRoutes.js";
import memoryRoutes from "./routes/memoryRoutes.js";

dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth",authRoutes);
app.use("/api/surprise",surpriseRoutes);
app.use("/api/memory",memoryRoutes);
app.get("/",(req,res)=>{
res.send("Vishaura API Running");
});

app.listen(process.env.PORT || 5000,()=>{
console.log("Server started");
});