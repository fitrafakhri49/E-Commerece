// src/routes/webhook.ts
import express from "express";
import { midtransWebhook } from "../controllers/webhook/midtransWebhook";

const router = express.Router();

router.post("/midtrans", midtransWebhook);

export default router;
