import { Router } from "express";
import { requireAuth } from "../../middlewares/auth";
import {  getProductById,getProducts } from "../../controllers/users/products";

const router=Router()

router.get("/products",requireAuth ,getProducts);
router.get("/products/:id", requireAuth,getProductById);
export default router;
