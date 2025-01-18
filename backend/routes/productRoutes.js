import express from "express";
import {
  addProduct,
  getProducts,
  deliteProduct,
  updateProductCategory,
  rateProduct,
  updateProduct,
} from "../controllers/productController.js";

const router = express.Router();
router.get("/", getProducts);
router.post("/add", addProduct);
router.post("/delite", deliteProduct);
router.put("/:productId/updateCategory", updateProductCategory);
router.post("/rate", rateProduct);
router.put("/:productId", updateProduct);
export default router;
