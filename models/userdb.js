var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        required: true,
    },
    idNumber: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    securityCode: {
        type: String,
        required: true,
    },
    designation: {
        type: String,
        required: true,
    },
    passengerType: {
        type: String,
        required: true,
    },
    profilePicture:{
        type: String,
        required: false,
    }
});

module.exports = mongoose.model('User', UserSchema);