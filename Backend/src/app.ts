import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/user";
import authRoutes from "./routes/auth";
import adminProductRoutes from "./routes/admins/products";
import userProductRoutes from "./routes/users/product";
import userCartRoutes from "./routes/users/carts";
import userCheckoutRoutes from "./routes/users/checkout";
import adminCheckoutRoutes from "./routes/admins/checkout";
import userTransactionRoutes from "./routes/users/transaction";
import webhook from "./routes/webhook";
import cors from "cors";


dotenv.config()
const app=express()
app.use(express.json())
app.use(cors({
    origin: "http://localhost:8081", // atau "*" untuk semua origin
    credentials: true, // jika perlu cookies atau authorization header
  }));
app.use("/api/webhook", webhook);
app.use("/api/v1",userRoutes,)
app.use("/api/v1/auth",authRoutes)
app.use("/api/v1/admin",adminProductRoutes,adminCheckoutRoutes)
app.use("/api/v1/user",userProductRoutes,userCartRoutes,userCheckoutRoutes,userTransactionRoutes)

const PORT=process.env.PORT

app.listen(PORT,()=>{
    console.log(`server berjalan di http://localhost:${PORT}`)
})