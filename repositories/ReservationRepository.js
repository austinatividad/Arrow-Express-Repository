const Reservation = require('../models/reservationdb.js');

const ReservationRepository = {
    /**
     * Create a new reservation.
     * @param {object} reservationData - The reservation data.
     * @returns {Promise<object>} The created reservation.
     */
    createReservation: async function (reservationData) {
        try {
            const reservation = new Reservation(reservationData);
            return await reservation.save();
        } catch (error) {
            console.error("Error creating reservation:", error);
            throw new Error("Failed to create reservation");
        }
    },

    /**
     * Find a specific reservation.
     * @param {object} query - The query to find the reservation.
     * @returns {Promise<object>} The found reservation.
     */
    findReservation: async function (query) {
        try {
            return await Reservation.findOne(query);
        } catch (error) {
            console.error("Error finding reservation:", error);
            throw new Error("Failed to find reservation");
        }
    },

    /**
     * Update a reservation.
     * @param {object} currentData - The current reservation data.
     * @param {object} newData - The new reservation data.
     * @returns {Promise<object>} The updated reservation.
     */
    updateReservation: async function (currentData, newData) {
        try {
            return await Reservation.updateOne(currentData, newData);
        } catch (error) {
            console.error("Error updating reservation:", error);
            throw new Error("Failed to update reservation");
        }
    },

    /**
     * Delete a reservation.
     * @param {object} query - The query to find the reservation to delete.
     * @returns {Promise<object>} The deletion result.
     */
    deleteReservation: async function (query) {
        try {
            return await Reservation.deleteOne(query);
        } catch (error) {
            console.error("Error deleting reservation:", error);
            throw new Error("Failed to delete reservation");
        }
    },

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
    },

    /**
     * Find entry reservations for a specific date, location and time.
     * @param {string} date - The date of the reservations.
     * @param {string} location - The entry location.
     * @param {string} time - The entry time.
     * @returns {Promise<Array>} Array of matching reservations.
     */
    findEntryReservations: async function (date, location, time) {
        try {
            return await Reservation.find({
                date,
                entryLoc: location,
                entryTime: time
            });
        } catch (error) {
            console.error("Error finding entry reservations:", error);
            throw new Error("Failed to retrieve entry reservations");
        }
    },

    /**
     * Find exit reservations for a specific date, location and time.
     * @param {string} date - The date of the reservations.
     * @param {string} location - The exit location.
     * @param {string} time - The exit time.
     * @returns {Promise<Array>} Array of matching reservations.
     */
    findExitReservations: async function (date, location, time) {
        try {
            return await Reservation.find({
                date,
                exitLoc: location,
                exitTime: time
            });
        } catch (error) {
            console.error("Error finding exit reservations:", error);
            throw new Error("Failed to retrieve exit reservations");
        }
    }
};

module.exports = ReservationRepository;
