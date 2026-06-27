import express from "express";
import {
  initializePayment,
  paymentNotify,
  confirmPayment,
} from "../controllers/paymentController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


// INIT PAYMENT (USER ONLY)

router.post("/initialize", protect, initializePayment);

// CONFIRM PAYMENT (FRONTEND FALLBACK)
   
router.post("/confirm", protect, confirmPayment);

export default router;