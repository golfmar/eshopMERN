import express from "express";
import Category from "../models/Category.js"; // Модель категории
const router = express.Router();

router.post("/", async (req, res) => {
  const { name } = req.body;

  try {
    let category = await Category.findOne({ name });
    if (!category) {
      category = new Category({ name });
      await category.save();
    }
    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create category" });
  }
});

router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    // Ищем категорию по ID
    let category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    category.name = name;
    await category.save();
    res.status(200).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update category" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await Category.findByIdAndDelete(id);
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Failed to delete category" });
  }
});

export default router;
