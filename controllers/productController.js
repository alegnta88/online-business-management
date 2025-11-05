import { createProduct, getProducts, deleteProduct, getProductById } from '../services/productService.js';

export const addProduct = async (req, res) => {
  try {
    const user = req.user; 
    const isAdmin = user?.role === 'admin';

    const productData = {
      ...req.body,
      status: isAdmin ? 'approved' : 'pending',
      addedBy: user?._id,
    };

    const product = await createProduct(productData, req.files || (req.file ? [req.file] : []));
    
    res.status(201).json({
      success: true,
      message: isAdmin
        ? 'Product added and approved successfully'
        : 'Product submitted for approval',
      product,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// List products
export const listProduct = async (req, res) => {
  try {
    const user = req.user;
    const isAdmin = user?.role === 'admin';

    const filter = isAdmin ? {} : { status: 'approved' };

    const data = await getProducts({ ...req.query, ...filter });

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

// admin approvbe product
export const approveProduct = async (req, res) => {
  try {
    const product = await approveProductById(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Product approved successfully',
      product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// admin reject product
export const rejectProduct = async (req, res) => {
  try {
    const product = await rejectProductById(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Product rejected successfully',
      product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};