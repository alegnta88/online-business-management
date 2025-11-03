import ProductModel from '../models/productModel.js';
import { uploadImage, deleteImage } from './cloudinaryService.js';
import mongoose from 'mongoose';

export const createProduct = async (data, files) => {
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
  });

  return await product.save();
};

export const getProducts = async (query) => {
  const { category, bestseller, page = 1, limit = 10 } = query;

  const filter = {};
  if (category) filter.category = category;
  if (bestseller) filter.bestseller = bestseller === 'true';

  const products = await ProductModel.find(filter)
    .sort({ date: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const count = await ProductModel.countDocuments(filter);

  return {
    products,
    count,
    totalPages: Math.ceil(count / limit),
    currentPage: Number(page),
  };
};

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

export const getProductById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new Error('Invalid product ID');

  const product = await ProductModel.findById(id);
  if (!product) throw new Error('Product not found');

  return product;
};