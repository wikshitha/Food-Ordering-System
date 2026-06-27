import crypto from "crypto";
import Order from "../models/order.js";

// INITIALIZE PAYMENT

export const initializePayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    const order = await Order.findById(orderId).populate(
      "userId",
      "name email"
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.paymentStatus === "Paid") {
      return res.status(400).json({
        success: false,
        message: "Order already paid",
      });
    }

    const merchantId = process.env.PAYHERE_MERCHANT_ID;
    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;

    const currency = "LKR";
    const amount = Number(order.totalAmount).toFixed(2);

    // Hash secret
    const hashedSecret = crypto
      .createHash("md5")
      .update(merchantSecret)
      .digest("hex")
      .toUpperCase();

    //PayHere hash
    const hash = crypto
      .createHash("md5")
      .update(
        merchantId +
          order._id.toString() +
          amount +
          currency +
          hashedSecret
      )
      .digest("hex")
      .toUpperCase();

    return res.status(200).json({
      success: true,

      payment: {
        merchant_id: merchantId,
        return_url: `${process.env.FRONTEND_URL}/payment-success`,
        cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
        notify_url: `${process.env.BACKEND_URL}/api/payment/notify`,

        order_id: order._id.toString(),
        items: "Food Order",

        currency,
        amount,

        first_name: order.userId.name,
        last_name: "",
        email: order.userId.email,
        phone: order.phone,
        address: order.deliveryAddress,
        city: "Colombo",
        country: "Sri Lanka",

        hash,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// PAYMENT NOTIFY (PayHere calls this automatically)
   
export const paymentNotify = async (req, res) => {
  try {
    const {
      merchant_id,
      order_id,
      payment_id,
      payhere_amount,
      payhere_currency,
      status_code,
      md5sig,
    } = req.body;

    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;

    // Generate local hash
    const hashedSecret = crypto
      .createHash("md5")
      .update(merchantSecret)
      .digest("hex")
      .toUpperCase();

    const localMd5sig = crypto
      .createHash("md5")
      .update(
        merchant_id +
          order_id +
          payhere_amount +
          payhere_currency +
          status_code +
          hashedSecret
      )
      .digest("hex")
      .toUpperCase();

    const order = await Order.findById(order_id);

    if (!order) {
      return res.status(404).send("Order not found");
    }

    //  SUCCESS PAYMENT
    if (localMd5sig === md5sig && status_code === "2") {
      order.paymentStatus = "Paid";
      order.paymentMethod = "PAYHERE";
      order.orderStatus = "Preparing";
      order.paymentId = payment_id;
    } else {
      //  FAILED PAYMENT
      order.paymentStatus = "Failed";
    }

    await order.save();

    return res.status(200).send("OK");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error");
  }
};

// CONFIRM PAYMENT (FRONTEND FALLBACK)
   
export const confirmPayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    const userId = req.user.id;

    if (!orderId) {
      return res.status(400).json({ success: false, message: "Order ID is required" });
    }

    const order = await Order.findOne({ _id: orderId, userId });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Idempotent — safe to call even if webhook already marked it Paid
    if (order.paymentStatus !== "Paid") {
      order.paymentStatus = "Paid";
      order.paymentMethod = "PAYHERE";
      order.orderStatus = "Preparing";
      await order.save();
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};