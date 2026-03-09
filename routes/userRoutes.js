import express from 'express';
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
    async(req,res)=>{
    try{
        const {fullname, email, password } = req.body;
        // console.log("email recieved",email);
        
        const existingUser = await User.findOne({email});
        // console.log("email recieved",existingUser);
        if(existingUser){
            return res.status(400).json({message : "User already exist with this email"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = new User({
            fullname,
            email,
            password : hashedPassword
        });

        const savedUser = await newUser.save();

        res.status(200).json({
            message: "User registered Successfully!",
            user: {
                _id : savedUser._id,
                fullname : savedUser.fullname,
                email : savedUser.email
            }
        })
    }
    catch(error){
        res.status(400).json({
            message : "Server Error",
            error : error.message
        })
    }
});

router.post(
    '/login',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists()
    ],
    validateRequest,
    async(req,res)=>{
    try{
        const {email,password} = req.body;

        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message : "Invalid email or password"});
        }

        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message : "Invalid email or passord"});
        }

        const token = jwt.sign(
            {userId: user._id},
            process.env.JWT_SECRET,
            {expiresIn: '1d'}
        )

        res.status(200).json({
            message: "Login successful!",
            token: token,
            user: {
                _id: user._id,
                fullname: user.fullname,
                email: user.email
            }
        });
    }
    catch(error){
        res.status(400).json({message: "Server Error",error: error.message});
    }
})


router.get('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

export default router;