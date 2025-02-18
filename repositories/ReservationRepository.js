const Reservation = require('../models/reservationdb.js');

const ReservationRepository = {
    /**
     * Find all reservations for a user.
     * @param {string} idNumber - The ID number of the user.
     * @returns {Promise<Array>} Array of reservations.
     */
    findUserReservations: async function (idNumber) {
        try {
            return await Reservation.find(
                { idNumber }, 
                { _id: 0, __v: 0 }
            );
        } catch (error) {
            console.error("Error finding user reservations:", error);
            throw new Error("Failed to retrieve reservations");
        }
    },

    /**
     * Delete all reservations for a user.
     * @param {string} idNumber - The ID number of the user.
     * @returns {Promise<void>}
     */
    deleteAllReservations: async function (idNumber) {
        try {
            await Reservation.deleteMany({ idNumber });
        } catch (error) {
            console.error("Error deleting reservations:", error);
            throw new Error("Failed to delete reservations");
        }
    }
};

module.exports = ReservationRepository;
