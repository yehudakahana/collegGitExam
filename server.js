import express from "express";
import userRouter from "./routes/userRoute.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger.js";
dotenv.config();
connectDB();
const port = process.env.PORT || 5000;
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/", userRouter);
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
