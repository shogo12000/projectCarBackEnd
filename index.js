import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import { connectDB } from "./mongoose/mongoose.mjs";
import mongoose from "mongoose";
dotenv.config();

 

const app = express();



const allowedOrigins = [
    "http://localhost:5174/",
    "http://localhost:5174",
    "https://carfrontend-ptv4v8k65-sidneys-projects-2af13f64.vercel.app/",
    "https://carfrontend-git-main-sidneys-projects-2af13f64.vercel.app",
    "https://carfrontend-rust.vercel.app/",
    "https://carfrontend-rust.vercel.app", 
];

app.use(cors({
    origin: function (origin, callback) { 
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    }, credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({ msg: "Servidor rodando!" });
});

app.get("/health", (req, res) => {
    const state = mongoose.connection.readyState;
    if (state === 1) {
        res.status(200).json({ status: "MongoDB connected" });
    } else {
        res.status(500).json({ status: "MongoDB not connected", state });
    }
});

export default async function handler(req, res) {
  await connectDB(); // garante conexão antes de responder
  return app(req, res);
}


const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));