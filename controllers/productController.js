import ProductModel from '../models/productModel.js';
import validator from 'validator';
import mongoose from 'mongoose';

// Function to create a new product
const addProduct = async (req, res) => {
    try {
        const { name, price, description, category, subcategory, sizes, bestseller } = req.body;

        // Validation
        if (!name || !price || !description || !category) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide all required fields' 
            });
        }

        // Validate price
        if (isNaN(price) || price <= 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid price' 
            });
        }

        const imageArray = [];
        
        if (req.file) {
            // Single file upload
            imageArray.push(req.file.filename);
        } else if (req.files && req.files.length > 0) {
            // Multiple files upload
            req.files.forEach(file => {
                imageArray.push(file.filename);
            });
        }
        
        if (imageArray.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'At least one product image is required' 
            });
        }

        // Parse sizes if it's a JSON string
        let parsedSizes = [];
        if (sizes) {
            try {
                parsedSizes = typeof sizes === 'string' ? JSON.parse(sizes) : sizes;
            } catch (error) {
                parsedSizes = Array.isArray(sizes) ? sizes : [sizes];
            }
        }

        // Create product object
        const productData = {
            name: name.trim(),
            price: Number(price),
            description: description.trim(),
            image: imageArray,
            category: category.trim(),
            subcategory: subcategory ? subcategory.trim() : '',
            sizes: parsedSizes,
            bestseller: bestseller === 'true' || bestseller === true,
            date: Date.now()
        };

        // Save to database
        const product = new ProductModel(productData);
        await product.save();

        res.status(201).json({ 
            success: true, 
            message: 'Product added successfully',
            product 
        });

    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error',
            error: error.message 
        });
    }
};

// Function to list all products
const listProduct = async (req, res) => {
    try {
        const { category, bestseller, page = 1, limit = 1 } = req.query;
        
        const filter = {};
        if (category) filter.category = category;
        if (bestseller) filter.bestseller = bestseller === 'true';

        const products = await ProductModel.find(filter)
            .sort({ date: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await ProductModel.countDocuments(filter);

        res.status(200).json({ 
            success: true, 
            count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            products 
        });

    } catch (error) {
        console.error('Error listing products:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error',
            error: error.message 
        });
    }
};

// Function to remove a product
const removeProduct = async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ 
                success: false, 
                message: 'Product ID is required' 
            });
        }

        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid product ID' 
            });
        }

        // Find and delete product
        const product = await ProductModel.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).json({ 
                success: false, 
                message: 'Product not found' 
            });
        }

        res.status(200).json({ 
            success: true, 
            message: 'Product removed successfully' 
        });

    } catch (error) {
        console.error('Error removing product:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error',
            error: error.message 
        });
    }
};

// Function to get a single product
const singleProduct = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ 
                success: false, 
                message: 'Product ID is required' 
            });
        }

        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid product ID' 
            });
        }

        const product = await ProductModel.findById(id);

        if (!product) {
            return res.status(404).json({ 
                success: false, 
                message: 'Product not found' 
            });
        }

        res.status(200).json({ 
            success: true, 
            product 
        });

    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error',
            error: error.message 
        });
    }
};

export { addProduct, listProduct, removeProduct, singleProduct };