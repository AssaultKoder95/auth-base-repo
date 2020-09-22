const User = require('../models/UserModel');

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

        return res.status(201).json({
            success: true,
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