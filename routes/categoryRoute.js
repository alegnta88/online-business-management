import express from "express";
import { createCategory, getAllCategories } from "../controllers/categoryController.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

router.post('/create', adminAuth, createCategory);
router.get('/', getAllCategories); 

export default router;
