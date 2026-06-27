import express from "express";
import {
  addToCart,
  getCart,
  removeFromCart,
  updateQuantity,
} from "../controllers/cartController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// all routes protected
router.post("/add", protect, addToCart);
router.get("/", protect, getCart);
router.delete("/:foodId", protect, removeFromCart);
router.put("/update", protect, updateQuantity);

export default router;