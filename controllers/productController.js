import { createProduct, getProducts, deleteProduct, getProductById } from '../services/productService.js';

// Create new product
export const addProduct = async (req, res) => {
  try {
    const product = await createProduct(req.body, req.files || (req.file ? [req.file] : []));
    res.status(201).json({
      success: true,
      message: 'Product added successfully',
      product,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// List products
export const listProduct = async (req, res) => {
  try {
    const data = await getProducts(req.query);
    res.status(200).json({ success: true, ...data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete product
export const removeProduct = async (req, res) => {
  try {
    const { id } = req.body;
    await deleteProduct(id);
    res.status(200).json({ success: true, message: 'Product removed successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get single product
export const singleProduct = async (req, res) => {
  try {
    const product = await getProductById(req.params.id);
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};