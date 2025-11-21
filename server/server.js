import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { configDotenv } from 'dotenv';
import connectDb from './config/connectDb.js';
import Router from './routes/userRoutes.js';
import createRequest from "./routes/requestRoutes.js"
import departmentRouter from './routes/departmentRoutes.js';
import router from './routes/assignRoutes.js';

configDotenv();
connectDb();

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  "http://localhost:5173",
  "https://sfcg-task.onrender.com"
];

// ✅ Global CORS Headers Fix (REQUIRED FOR RENDER)
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);  // ⬅ IMPORTANT: handles preflight
  }

  next();
});

// Also apply Express CORS (safe)
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", Router);
app.use("/api/request", createRequest);
app.use("/api/department", departmentRouter);
app.use("/api/assign", router);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
