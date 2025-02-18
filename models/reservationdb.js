var mongoose = require('mongoose');

var ReservationSchema = new mongoose.Schema({
    startCampus: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        require: true,
    },
    entryLoc: {
        type: String,
        required: true,
    },
    entryTime: {
        type: String,
        required: true,
    },
    exitLoc: {
        type: String,
        required: true,
    },
    exitTime: {
        type: String,
        required: true,
    },
    idNumber: { //This is used to bind a reservation to a user. Many-to-one relation.
        type: Number,
        required: false,
    }
});

module.exports = mongoose.model('Reservation', ReservationSchema);
