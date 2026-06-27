import Food from "../models/food.js";
import cloudinary from "../config/cloudinary.js";


// ADD FOOD (ADMIN)
export const addFood = async (req, res) => {
  try {
    const { name, description, price, image, category } = req.body;

    if (!image) {
      return res.status(400).json({ message: "Image is required" });
    }

    // upload base64 image to cloudinary
    const uploadedImage = await cloudinary.uploader.upload(image, {
      folder: "food_app",
    });

    const food = await Food.create({
      name,
      description,
      price,
      category,
      image: uploadedImage.secure_url,
    });

    res.status(201).json({
      message: "Food added successfully",
      food,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET ALL FOODS

export const getFoods = async (req, res) => {
  try {
    const foods = await Food.find().sort({ createdAt: -1 });

    res.status(200).json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET SINGLE FOOD

export const getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    res.status(200).json(food);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// DELETE FOOD (ADMIN)

export const deleteFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    await food.deleteOne();

    res.status(200).json({ message: "Food deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};