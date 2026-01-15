// src/routes/checkout.ts
import { Router } from "express";
import { checkout } from "../../controllers/users/checkout";
import { requireAuth } from "../../middlewares/auth";

const router = Router();

router.post("/checkout", requireAuth, checkout);

export default router;
