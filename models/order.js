import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
    product : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {type: Number, required: true ,default: 1},
    price: {type: Number,required: true}
})

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderItems: [orderItemSchema],
    totalAmount: {type: Number,required: true},
    paymentStatus: {
        type: String,
        enum: ['pending','completed','failed'],
        default: 'pending'
    },
    stripeSessionId: {type: String}
},{timestamps: true})

const order = mongoose.model('Order', orderSchema);
export default order;