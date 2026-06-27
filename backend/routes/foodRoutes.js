import express from "express";
import {
  addFood,
  getFoods,
  getFoodById,
  deleteFood,
} from "../controllers/foodController.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getFoods);
router.get("/:id", getFoodById);

// Admin routes
router.post("/", protect, adminOnly, addFood);
router.delete("/:id", protect, adminOnly, deleteFood);

export default router;