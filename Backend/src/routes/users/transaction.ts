import { Router } from "express";
import { requireAuth } from "../../middlewares/auth";
import { getUserTransactions } from "../../controllers/users/transaction";
const router=Router()
router.get("/transactions",requireAuth,getUserTransactions)

export default router