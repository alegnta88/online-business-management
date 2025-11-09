import { 
  createCategoryService, 
  getAllCategoriesService 
} from "../services/categoryService.js";

export const createCategory = async (req, res) => {
  try {
    const category = await createCategoryService(req.user, req.body);
    res.status(201).json({ success: true, category });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await getAllCategoriesService();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
