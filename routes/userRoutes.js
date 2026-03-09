import express from 'express';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import protect from '../middleware/auth.js';
import dotenv from 'dotenv';
import { check } from 'express-validator';
import { validateRequest } from '../middleware/validation.js';

dotenv.config();

const router = express.Router();

router.post(
    '/register',
    [
        check('fullname', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
    ],
    validateRequest,
    asyncHandler(async (req, res) => {
        const { fullname, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400);
            throw new Error("User already exist with this email");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullname,
            email,
            password: hashedPassword
        });

        const savedUser = await newUser.save();

        res.status(201).json({
            message: "User registered Successfully!",
            user: {
                _id: savedUser._id,
                fullname: savedUser.fullname,
                email: savedUser.email
            }
        });
    })
);

router.post(
    '/login',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists()
    ],
    validateRequest,
    asyncHandler(async (req, res) => {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({
                message: "Logged in successfully",
                token
            });
        } else {
            res.status(401);
            throw new Error("Invalid email or password");
        }
    })
);

router.get('/profile', protect, asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.userId).select('-password');
    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
}));

export default router;