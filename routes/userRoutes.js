const express = require('express');
const { signup, login, protect } = require('../controllers/authController');
const { getAllUsers } = require('../controllers/userController');

const router = express.Router();

router.get('/dashboard', protect, getAllUsers);
router.post('/signup', signup);
router.post('/login', login);

module.exports = router;