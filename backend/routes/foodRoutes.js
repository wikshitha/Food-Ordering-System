import express from "express";
import {
  addFood,
  getFoods,
  getFoodById,
  deleteFood,
  updateFood,
} from "../controllers/foodController.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getFoods);
router.get("/:id", getFoodById);

// Admin routes
router.post("/", protect, adminOnly, upload.single("image"), addFood);
router.put("/:id", protect, adminOnly, upload.single("image"), updateFood);
router.delete("/:id", protect, adminOnly, deleteFood);

export default router;