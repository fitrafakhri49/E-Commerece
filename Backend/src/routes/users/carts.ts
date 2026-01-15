import { Router } from "express";
import { requireAuth } from "../../middlewares/auth";
import {
  getItemCarts,
  addItemToCart,
  decreasIncreaseItemToCart,
} from "../../controllers/users/carts";

const router = Router();

router.get("/cart", requireAuth, getItemCarts);
router.post("/cart", requireAuth, addItemToCart);
router.patch("/cart/:productId", requireAuth, decreasIncreaseItemToCart);

export default router;
