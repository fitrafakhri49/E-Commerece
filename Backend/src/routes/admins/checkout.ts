import { Router } from "express";
import { requireAdmin,requireAuth } from "../../middlewares/auth";
import {  approveTransaction,rejectTransaction,getAllTransactions} from "../../controllers/admins/transaction";


const router = Router();


router.patch("/transactions/:transactionId/approve",requireAuth,requireAdmin,approveTransaction);
router.patch("/transactions/:transactionId/reject",requireAuth,requireAdmin,rejectTransaction);
router.get("/transactions",requireAuth,requireAdmin,getAllTransactions );
  
  

export default router;
