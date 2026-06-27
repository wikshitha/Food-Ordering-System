import Cart from "../models/cart.js";
import Food from "../models/food.js";


// ADD TO CART

export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { foodId, quantity } = req.body;

    const food = await Food.findById(foodId);

    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    let cart = await Cart.findOne({ userId });

    // if no cart create new
    if (!cart) {
      cart = new Cart({
        userId,
        items: [
          {
            foodId: food._id,
            name: food.name,
            price: food.price,
            image: food.image,
            quantity: quantity || 1,
          },
        ],
      });

      await cart.save();

      return res.status(201).json({
        message: "Item added to cart",
        cart,
      });
    }

    // check if item already exists
    const existingItem = cart.items.find(
      (item) => item.foodId.toString() === foodId
    );

    if (existingItem) {
      existingItem.quantity += quantity || 1;
    } else {
      cart.items.push({
        foodId: food._id,
        name: food.name,
        price: food.price,
        image: food.image,
        quantity: quantity || 1,
      });
    }

    await cart.save();

    res.status(200).json({
      message: "Cart updated",
      cart,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET USER CART
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      return res.status(200).json({ items: [] });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// REMOVE ITEM FROM CART

export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { foodId } = req.params;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.foodId.toString() !== foodId
    );

    await cart.save();

    res.status(200).json({
      message: "Item removed",
      cart,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// UPDATE QUANTITY

export const updateQuantity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { foodId, quantity } = req.body;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find(
      (i) => i.foodId.toString() === foodId
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    item.quantity = quantity;

    await cart.save();

    res.status(200).json({
      message: "Quantity updated",
      cart,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};