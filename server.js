import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Stripe from 'stripe';

import { errorHandler } from './middleware/errorMiddleware.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import Order from './models/order.js'

dotenv.config();

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const signature = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (error) {
        console.error("Webhook signature verification failed:", error.message);
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        const orderId = session.metadata.orderId;

        try {
            const paidOrder = await Order.findByIdAndUpdate(
                orderId, 
                { paymentStatus: 'completed' }, 
                { new: true }
            );
            console.log("💰 Payment successful! Order updated:", paidOrder._id);
        } catch (dbError) {
            console.error("Database update failed:", dbError);
        }
    }

    res.status(200).send();
});

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

app.use(errorHandler);

const PORT = 5000;

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected Successfully"))
.catch((err) => console.log("MongoDB Connection Error:", err));



app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})