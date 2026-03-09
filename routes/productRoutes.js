import express from 'express';
import asyncHandler from 'express-async-handler';
import Product from '../models/product.js';
import protect from '../middleware/auth.js';
import { check } from 'express-validator';
import { validateRequest } from '../middleware/validation.js';

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
    const products = await Product.find({});
    res.status(200).json(products);
}));

router.post(
    '/',
    protect,
    [
        check('name', 'Product name is required').not().isEmpty(),
        check('price', 'Price must be a positive number').isFloat({ gt: 0 }),
        check('description', 'Description is required').not().isEmpty(),
        check('category', 'category is required').not().isEmpty(),
        check('stock', 'Stock value must be a positive number').isFloat({ gt: 0 }),
    ],
    validateRequest,
    asyncHandler(async (req, res) => {
        const newProduct = new Product(req.body);
        const saveProduct = await newProduct.save();
        res.status(201).json(saveProduct);
    })
)

export default router;