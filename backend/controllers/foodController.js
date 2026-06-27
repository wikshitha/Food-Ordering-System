import Food from "../models/food.js";
import cloudinary from "../config/cloudinary.js";

// Helper: upload a buffer to Cloudinary via stream
const uploadToCloudinary = (buffer, folder) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });

// ADD FOOD (ADMIN)
export const addFood = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    // Upload the in-memory buffer straight to Cloudinary
    const uploadedImage = await uploadToCloudinary(req.file.buffer, "food_app");

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


// UPDATE FOOD (ADMIN)

export const updateFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    const { name, description, price, category } = req.body;

    if (name !== undefined) food.name = name;
    if (description !== undefined) food.description = description;
    if (price !== undefined) food.price = Number(price);
    if (category !== undefined) food.category = category;

    // If a new image was uploaded, replace it on Cloudinary
    if (req.file) {
      const uploaded = await uploadToCloudinary(req.file.buffer, "food_app");
      food.image = uploaded.secure_url;
    }

    await food.save();

    res.status(200).json({ message: "Food updated successfully", food });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};