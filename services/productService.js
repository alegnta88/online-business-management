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

export const getProducts = async (queryParams) => {
  const limit = parseInt(queryParams.limit) || 5;
  const cursor = queryParams.cursor;

  const filter = {};
  if (queryParams.category) filter.category = queryParams.category;
  if (queryParams.bestseller) filter.bestseller = queryParams.bestseller === 'true';

  const cursorQuery = cursor ? { _id: { $gt: cursor } } : {};

  const products = await ProductModel.find({ ...filter, ...cursorQuery })
    .sort({ _id: 1 })
    .limit(limit);

  const nextCursor = products.length ? products[products.length - 1]._id : null;

  return {
    products,
    nextCursor,
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