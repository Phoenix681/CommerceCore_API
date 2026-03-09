import express from 'express';
import Product from '../models/product.js';
import { check } from 'express-validator';
import { validateRequest } from '../middleware/validation.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try{
        const products = await Product.find({});
        res.status(200).json(products);
    }
    catch(error){
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Failed to fetch products" });
    }
});

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
    async (req, res) => {
    try{
        const newProduct = new Product(req.body);
        const saveProduct = await newProduct.save();
        res.status(201).json(saveProduct);
    }
    catch(error){
        console.error("Error saving product:", error);
        res.status(500).json({ error: "Failed to save product" });
    }
})

export default router;