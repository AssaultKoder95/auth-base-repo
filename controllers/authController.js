const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/UserModel');

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

// @desc    SIGNUP FOR NEW USER
// @route   POST /ap1/v1/users/signup
// @access  PUBLIC
exports.signup = async (req, res, next) => {
    try {
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm
        });

        const token = signToken(newUser._id);

        return res.status(201).json({
            success: true,
            token,
            data: newUser
        })

    } catch (err) {
        if(err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({
              success: false,
              error: messages
            })
        }
        if(err.code === 11000) {
            return res.status(400).json({
                success: false,
                error: 'This email is already registered!'
            }) 
        }
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        }) 
    }
}

// @desc    LOGIN FOR USER
// @route   POST /api/v1/users/login
// @access  PUBLIC
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if(!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Please provide email and password'
            })
        }

        const user = await User.findOne({ email });

        if(!user || password!==user.password) {
            return res.status(401).json({
                success: false,
                error: 'Incorrect email or password'
            })
        }

        const token = signToken(user._id);

        return res.status(200).json({
            success: true,
            token
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        }) 
    }
}

exports.protect = async (req, res, next) => {
    try {
        let token;
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
    
        //console.log(token);
    
        if(!token) {
            return res.status(401).json({
                success: false,
                error: 'You are not logged in! Log in to get access'
            }) 
        }
    
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
        //console.log(decoded);

        const currentUser = await User.findById(decoded.id);

        if(!currentUser) {
            return res.status(401).json({
                success: false,
                error: 'The user belonging to this token do not exist anymore.'
            }) 
        }

        req.user = currentUser;
        next();
        
    } catch (err) {
        if(err.name === 'JsonWebTokenError'){
            return res.status(401).json({
                success: false,
                error: 'Invalid Token! Log in again.'
            })
        }
        if(err.name === 'TokenExpiredError'){
            return res.status(401).json({
                success: false,
                error: 'Token Expired! Log in again.'
            })
        }
    }
}