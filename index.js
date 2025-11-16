import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import { connectDB } from "./mongoose/mongoose.mjs";
import mongoose from "mongoose";
import carsRoutes from "./routes/carRoutes.mjs";
import cookieParser from "cookie-parser";

dotenv.config();

// connectDB();

const app = express();

const allowedOrigins = [
    "http://localhost:5174",
    "http://localhost:5173",
    "http://localhost:5173/mycars",
    "https://carfrontend-rust.vercel.app",
    "https://carfrontend-git-main-sidneys-projects-2af13f64.vercel.app",
    "https://carfrontend-k7ioppyld-sidneys-projects-2af13f64.vercel.app"
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use((req, res, next) => {
    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
    }

    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }

    next();
});

app.use(cookieParser());

app.use(express.json());

app.use("/cars", carsRoutes);

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
  await connectDB();  
  return app(req, res);
}


const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));