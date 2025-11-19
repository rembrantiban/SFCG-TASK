import express from 'express';
import  cors from 'cors';
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

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", Router)
app.use("/api/request", createRequest)
app.use("/api/department", departmentRouter)
app.use("/api/assign" , router)

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
