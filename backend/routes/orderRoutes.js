import express from "express";

import {
  placeOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  getOrderById,
} from "../controllers/orderController.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/", protect, placeOrder);

router.get("/my-orders", protect, getUserOrders);

router.get("/", protect, adminOnly, getAllOrders);

router.get("/:id", protect, getOrderById);

router.put("/:id", protect, adminOnly, updateOrderStatus);

export default router;