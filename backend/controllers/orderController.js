import Order from "../models/order.js";
import Cart from "../models/cart.js";

// PLACE ORDER

export const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      deliveryAddress,
      phone,
      paymentMethod,
    } = req.body;

    const cart = await Cart.findOne({
      userId,
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    let totalAmount = 0;

    cart.items.forEach((item) => {
      totalAmount += item.price * item.quantity;
    });

    const order = await Order.create({
      userId,
      items: cart.items,
      totalAmount,
      deliveryAddress,
      phone,
      paymentMethod,
      paymentStatus:
        paymentMethod === "COD"
          ? "Pending"
          : "Pending",
    });

    cart.items = [];

    await cart.save();

    res.status(201).json({
      message: "Order Created",
      order,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

// GET USER ORDERS

export const getUserOrders = async (req, res) => {

  try {

    const orders = await Order.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(orders);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

// ADMIN - GET ALL ORDERS

export const getAllOrders = async (req, res) => {

  try {

    const orders = await Order.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};


// ADMIN UPDATE STATUS

export const updateOrderStatus = async (req, res) => {

  try {

    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.orderStatus = status;

    await order.save();

    res.json({
      message: "Order updated successfully",
      order,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};