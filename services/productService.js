import ProductModel from '../models/productModel.js';
import { uploadImage, deleteImage } from './cloudinaryService.js';
import mongoose from 'mongoose';

export const createProduct = async (data, files, user) => {
  const { name, price, description, category, subcategory, sizes, bestseller } = data;

  if (!name || !price || !description || !category) {
    throw new Error('Please provide all required fields');
  }

  if (isNaN(price) || price <= 0) {
    throw new Error('Invalid price');
  }

  const imageArray = [];

  if (files?.length > 0) {
    for (const file of files) {
      const url = await uploadImage(file.path);
      imageArray.push(url);
    }
  }

  if (imageArray.length === 0) {
    throw new Error('At least one product image is required');
  }

  let parsedSizes = [];
  if (sizes) {
    try {
      parsedSizes = typeof sizes === 'string' ? JSON.parse(sizes) : sizes;
    } catch {
      parsedSizes = Array.isArray(sizes) ? sizes : [sizes];
    }
  }

  // Determine product status based on user role
  const productStatus = user?.role === 'admin' ? 'approved' : 'pending';

  const product = new ProductModel({
    name: name.trim(),
    price: Number(price),
    description: description.trim(),
    image: imageArray,
    category: category.trim(),
    subcategory: subcategory?.trim() || '',
    sizes: parsedSizes,
    bestseller: bestseller === 'true' || bestseller === true,
    date: Date.now(),
    status: productStatus,
    addedBy: user?._id,
  });

  return await product.save();
};

// List all products
// Temporarily add this at the start of getProducts to debug
export const getProducts = async (queryParams, user) => {
  console.log('User role:', user?.role);
  console.log('Query params:', queryParams);
  
  const limit = parseInt(queryParams.limit) || 8;
  const cursor = queryParams.cursor;

  const filter = {};

  if (queryParams.category) filter.category = queryParams.category;
  if (queryParams.bestseller) filter.bestseller = queryParams.bestseller === 'true';

  // Handle status filtering
  if (user?.role === 'admin') {
    if (queryParams.status) {
      filter.status = queryParams.status;
    }
  } else {
    filter.status = 'approved';
  }

  console.log('Final filter:', filter); // CHECK THIS OUTPUT

  const cursorQuery = cursor ? { _id: { $lt: cursor } } : {};

  const products = await ProductModel.find({ ...filter, ...cursorQuery })
    .sort({ _id: -1 })
    .limit(limit + 1);

  console.log('Products found:', products.length);
  console.log('Product statuses:', products.map(p => ({ name: p.name, status: p.status })));

  const hasMore = products.length > limit;
  const resultProducts = hasMore ? products.slice(0, limit) : products;
  const nextCursor = hasMore ? resultProducts[resultProducts.length - 1]._id : null;

  return {
    products: resultProducts,
    nextCursor,
    hasMore,
  };
};

// Delete product

export const deleteProduct = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new Error('Invalid product ID');

  const product = await ProductModel.findById(id);
  if (!product) throw new Error('Product not found');

  if (product.image?.length > 0) {
    for (const imageUrl of product.image) {
      await deleteImage(imageUrl);
    }
  }

  await ProductModel.findByIdAndDelete(id);
  return true;
};

// Get product by ID

export const getProductById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new Error('Invalid product ID');

  const product = await ProductModel.findById(id);
  if (!product) throw new Error('Product not found');

  return product;
};

export const approveProductById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new Error('Invalid product ID');

  const product = await ProductModel.findById(id);
  if (!product) throw new Error('Product not found');

  product.status = 'approved';
  await product.save();

  return product;
};

export const rejectProductById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new Error('Invalid product ID');

  const product = await ProductModel.findById(id);
  if (!product) throw new Error('Product not found');

  product.status = 'rejected';
  await product.save();

  return product;
};