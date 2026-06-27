import express from "express";
import {
  initializePayment,
  paymentNotify,
} from "../controllers/paymentController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* =========================
   INIT PAYMENT (USER ONLY)
========================= */
router.post("/initialize", protect, initializePayment);

/* =========================
   PAYHERE WEBHOOK (NO PROTECT)
   IMPORTANT: PayHere must access this
========================= */
router.post("/notify", paymentNotify);

export default router;