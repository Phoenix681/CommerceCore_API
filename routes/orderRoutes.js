import express from 'express';
import asyncHandler from 'express-async-handler';
import Stripe from 'stripe';
import Order from '../models/order.js';
import Product from '../models/product.js';
import protect from '../middleware/auth.js';
import dotenv from 'dotenv';
import { check } from 'express-validator';
import { validateRequest } from '../middleware/validation.js';

dotenv.config();

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post(
    '/',
    protect,
    [
        check('orderItems', 'No order items provided').isArray({ min: 1 })

    ],
    validateRequest,
    asyncHandler(async (req, res) => {
        const { orderItems } = req.body;

        if (!orderItems || orderItems.length === 0) {
            res.status(400);
            throw new Error("No order items Provided");
        }

        let calculatedTotal = 0;
        const verifiedOrderItems = [];

        for(let i=0;i<orderItems.length;i++){
            const item = orderItems[i];

            const dbProduct = await Product.findById(item.product);

            if (!dbProduct) {
                res.status(404);
                throw new Error(`Product not found: ${item.product}`);
            }

            verifiedOrderItems.push({
                product: item.product,
                quantity: item.quantity,
                price: dbProduct.price
            })

            calculatedTotal += (dbProduct.price * item.quantity);
        }

        const newOrder = new Order({
            user: req.user.userId,
            orderItems: verifiedOrderItems,
            totalAmount: calculatedTotal,
        });

        const saveOrder = await newOrder.save();

        res.status(201).json({
            message: "Order Successfully Added",
            order: saveOrder
        })
    })
);

router.post('/create-checkout-session', protect, asyncHandler(async (req, res) => {
    const { orderId } = req.body;

    const order = await Order.findById(orderId).populate('orderItems.product');

    if (!order) {
        res.status(404);
        throw new Error("Order not found");
    }

    const lineItems = order.orderItems.map((item) => {
        return {
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.product.name,
                },
                unit_amount: item.price * 100,
            },
            quantity: item.quantity,
        };
    });


    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        metadata: { orderId: order._id.toString() },
        success_url: `${process.env.CLIENT_URL}/success.html`,
        cancel_url: `${process.env.CLIENT_URL}/cancel.html`,
    });

    res.json({ id: session.id });
}));

export default router;