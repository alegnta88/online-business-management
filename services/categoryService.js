import CategoryModel from "../models/categoryModel.js";

export const createCategoryService = async (user, { name, description }) => {
  if (user.role !== "admin") {
    throw new Error("Only admin can create categories");
  }

  const existing = await CategoryModel.findOne({ name: name.trim() });
  if (existing) {
    throw new Error("Category already exists");
  }

  const category = new CategoryModel({
    name: name.trim(),
    description,
  });

  await category.save();
  return category;
};

export const getAllCategoriesService = async () => {
  return await CategoryModel.find().sort({ createdAt: -1 });
};
