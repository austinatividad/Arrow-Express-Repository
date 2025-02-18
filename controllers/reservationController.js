const UserRepository = require('../repositories/UserRepository.js');
const AdminRepository = require('../repositories/AdminRepository.js');
const ReservationRepository = require('../repositories/ReservationRepository.js');

const reservationController = {
    getReservations: async function (req, res) {
        try {
            const { idNumber } = req.query;
            
            if (req.session.idNumber !== idNumber) {
                return res.redirect('/Reservation?idNumber=' + req.session.idNumber);
            }

            const isAdmin = await AdminRepository.findById(idNumber);
            const reservations = await ReservationRepository.findUserReservations(idNumber);

            res.render('Reservation', {
                displayUI: isAdmin ? 1 : 0,
                result: reservations,
                idNumber,
                isAdmin: !!isAdmin
            });
        } catch (error) {
            console.error('Error retrieving reservations:', error);
            res.render('Error', { error: 'Failed to retrieve reservations' });
        }
    },

    getReservationAdmin: async function (req, res) {
        try {
            const { idNumber } = req.query;
            
            if (req.session.idNumber !== idNumber) {
                const isAdmin = await AdminRepository.findById(req.session.idNumber);
                if (isAdmin) {
                    return res.redirect('/ReservationAdmin?idNumber=' + req.session.idNumber);
                }
                return res.render('Error', { error: 'Unauthorized access' });
            }

            res.render('ReservationAdmin', { idNumber });
        } catch (error) {
            console.error('Error accessing admin reservations:', error);
            res.render('Error', { error: 'Failed to access admin reservations' });
        }
    },

    postReservations: async function (req, res) {
        try {
            let idNumber;
            if (req.body.user_idNumber) {
                const user = await UserRepository.findById(req.body.user_idNumber);
                const admin = await AdminRepository.findById(req.body.user_idNumber);
                
                if (!user && !admin) {
                    return res.redirect('/Reservation?idNumber=' + req.body.adminId + '&reserveUserSuccess=false');
                }
                idNumber = req.body.user_idNumber;
            } else {
                idNumber = req.body.hiddenIdNumber;
            }

            const reservationData = {
                idNumber,
                startCampus: req.body.hiddenStartCampus,
                date: req.body.user_date,
                entryLoc: req.body.hiddenEntryLoc,
                entryTime: req.body.hiddenEntryTime,
                exitLoc: req.body.hiddenExitLoc,
                exitTime: req.body.hiddenExitTime
            };

            if (reservationData.entryLoc === "Entry Location" || 
                reservationData.entryTime === "Entry Time" || 
                reservationData.exitLoc === "Exit Location" || 
                reservationData.exitTime === "Exit Time") {
                return res.redirect('/Reservation?idNumber=' + req.body.adminId + '&reserveUserSuccess=false');
            }

            await ReservationRepository.createReservation(reservationData);
            res.redirect('/Reservation?idNumber=' + req.body.adminId + '&reserveUserSuccess=true');
        } catch (error) {
            console.error('Error creating reservation:', error);
            res.redirect('/Reservation?idNumber=' + req.body.adminId + '&reserveUserSuccess=false');
        }
    },

    postUpdateReservations: async function (req, res) {
        try {
            const currentData = {
                startCampus: req.body.eCurrStartCampus,
                date: req.body.eCurrDate,
                entryLoc: req.body.eCurrEntryLoc,
                entryTime: req.body.eCurrEntryTime,
                exitLoc: req.body.eCurrExitLoc,
                exitTime: req.body.eCurrExitTime,
                idNumber: req.body.eCurrIdNumber
            };

            const newData = {
                startCampus: req.body.ehiddenStartCampus,
                date: req.body.user_date,
                entryLoc: req.body.ehiddenEntryLoc,
                entryTime: req.body.ehiddenEntryTime,
                exitLoc: req.body.ehiddenExitLoc,
                exitTime: req.body.ehiddenExitTime,
                idNumber: req.body.ehiddenIdNumber
            };

            if (newData.entryLoc === "Entry Location" || 
                newData.entryTime === "Entry Time" || 
                newData.exitLoc === "Exit Location" || 
                newData.exitTime === "Exit Time") {
                return res.redirect('/Reservation?idNumber=' + newData.idNumber + '&isUpdateSuccess=false');
            }

            const existingReservation = await ReservationRepository.findReservation(currentData);
            if (!existingReservation) {
                throw new Error('Reservation not found');
            }

            await ReservationRepository.updateReservation(currentData, newData);
            res.redirect('/Reservation?idNumber=' + newData.idNumber + '&isUpdateSuccess=true');
        } catch (error) {
            console.error('Error updating reservation:', error);
            res.redirect('/Reservation?idNumber=' + req.body.ehiddenIdNumber + '&isUpdateSuccess=false');
        }
    },

    postDelete: async function (req, res) {
        try {
            const reservationData = {
                startCampus: req.body.dCurrStartCampus,
                date: req.body.dCurrDate,
                entryLoc: req.body.dCurrEntryLoc,
                entryTime: req.body.dCurrEntryTime,
                exitLoc: req.body.dCurrExitLoc,
                exitTime: req.body.dCurrExitTime,
                idNumber: req.body.dCurrIdNumber
            };

            await ReservationRepository.deleteReservation(reservationData);
            res.redirect('/Reservation?idNumber=' + reservationData.idNumber + '&isDeleteSuccess=true');
        } catch (error) {
            console.error('Error deleting reservation:', error);
            res.redirect('/Reservation?idNumber=' + req.body.dCurrIdNumber + '&isDeleteSuccess=false');
        }
    },

    getSearchUser: function (req, res) {
        res.render('SearchUser');
    },

    postSearchUser: async function (req, res) {
        try {
            const { payload } = req.body;
            const searchTerm = payload.trim();
            const users = await UserRepository.searchUsers(searchTerm);
            res.send({ payload: users });
        } catch (error) {
            console.error('Error searching users:', error);
            res.status(500).send({ error: 'Search failed' });
        }
    },

    postSearchUserUpdate: async function (req, res) {
        try {
            const currentData = {
                startCampus: req.body.eCurrStartCampus,
                date: req.body.eCurrDate,
                entryLoc: req.body.eCurrEntryLoc,
                entryTime: req.body.eCurrEntryTime,
                exitLoc: req.body.eCurrExitLoc,
                exitTime: req.body.eCurrExitTime,
                idNumber: req.body.eCurrIdNumber
            };

            const newData = {
                startCampus: req.body.ehiddenStartCampus,
                date: req.body.user_date,
                entryLoc: req.body.ehiddenEntryLoc,
                entryTime: req.body.ehiddenEntryTime,
                exitLoc: req.body.ehiddenExitLoc,
                exitTime: req.body.ehiddenExitTime,
                idNumber: req.body.ehiddenIdNumber
            };

            if (newData.entryLoc === "Entry Location" || 
                newData.entryTime === "Entry Time" || 
                newData.exitLoc === "Exit Location" || 
                newData.exitTime === "Exit Time") {
                return res.redirect('/ReservationAdmin?idNumber=' + req.body.adminId + '&isUpdateSuccess=false');
            }

            const existingReservation = await ReservationRepository.findReservation(currentData);
            if (!existingReservation) {
                throw new Error('Reservation not found');
            }

            await ReservationRepository.updateReservation(currentData, newData);
            res.redirect('/ReservationAdmin?idNumber=' + req.body.adminId + '&isUpdateSuccess=true');
        } catch (error) {
            console.error('Error updating user reservation:', error);
            res.redirect('/ReservationAdmin?idNumber=' + req.body.adminId + '&isUpdateSuccess=false');
        }
    },

    postSearchUserDelete: async function (req, res) {
        try {
            const reservationData = {
                startCampus: req.body.dCurrStartCampus,
                date: req.body.dCurrDate,
                entryLoc: req.body.dCurrEntryLoc,
                entryTime: req.body.dCurrEntryTime,
                exitLoc: req.body.dCurrExitLoc,
                exitTime: req.body.dCurrExitTime,
                idNumber: req.body.dCurrIdNumber
            };

            await ReservationRepository.deleteReservation(reservationData);
            res.redirect('/ReservationAdmin?idNumber=' + req.body.adminId + '&isDeleteSuccess=true');
        } catch (error) {
            console.error('Error deleting user reservation:', error);
            res.redirect('/ReservationAdmin?idNumber=' + req.body.adminId + '&isDeleteSuccess=false');
        }
    }
};

module.exports = reservationController;
