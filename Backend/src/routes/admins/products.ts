import { Router } from "express";
// import { login, register} from "../controllers/auth";
import { requireAdmin,requireAuth } from "../../middlewares/auth";
import { createProduct,deleteProduct,getProductById,getProducts,updateProduct,addProductImages } from "../../controllers/admins/product";
import { upload } from "../../utils/multer";

const router = Router();

router.post("/products",requireAuth,requireAdmin,upload.array("images", 5),createProduct);
  router.get("/products", getProducts);
  router.get("/products/:id", getProductById);
  router.patch("/products/:id",requireAuth,requireAdmin,upload.array("images", 5),updateProduct);
  router.delete("/products/:id", requireAuth, requireAdmin, deleteProduct);
  router.patch("/products/:id/images",requireAuth,requireAdmin,upload.array("images", 5), addProductImages);// maksimal 5 file sekaligus
  

export default router;
