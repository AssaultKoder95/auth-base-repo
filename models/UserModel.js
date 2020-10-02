const mongoose = require('mongoose');
const validator = require('validator');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Tell us your name🙏']
    },
    email: {
        type: String,
        required: [true, 'Tell us your email🙏'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email!']
    },
    password: {
        type: String,
        required: [true, 'Provide a password🙏'],
        minlength: 8
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            validator: function(el) {
                return el === this.password;
            },
            message: 'Passwords are not the same!'
        }
    }
});

UserSchema.pre('save', function(next) {
    this.passwordConfirm = undefined;
    next();
});

module.exports = mongoose.model('User', UserSchema);