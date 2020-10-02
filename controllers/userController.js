const User = require('../models/UserModel');


// @desc    GET ALL USERS
// @route   GET /ap1/v1/users
// @access  PRIVATE
exports.getAllUsers = async (req, res, next) => {
    const users = await User.find();

    return res.status(200).json({
        success: true,
        results: users.length,
        data: users
    });
}