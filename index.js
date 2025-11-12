import express from "express";
import cors from "cors";
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const allowedOrigins = [
    "http://localhost:5174/",
    "http://localhost:5174",
    "https://carfrontend-ptv4v8k65-sidneys-projects-2af13f64.vercel.app/",
    "https://carfrontend-git-main-sidneys-projects-2af13f64.vercel.app"
];

app.use(cors({
    origin: function (origin, callback) {
        // Se não houver origin (ex: Postman) ou se estiver na lista de permitidos
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

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));