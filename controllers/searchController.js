const UserRepository = require('../repositories/UserRepository.js');
const ReservationRepository = require('../repositories/ReservationRepository.js');

const searchController = {
    getSearch: function (req, res) {
        res.render('Search');
    },

    postUserSearch: async function (req, res) {
        try {
            const payload = req.body.payload.trim();
            const searchResults = await UserRepository.searchUsers(payload);
            res.send({ payload: searchResults });
        } catch (error) {
            console.error('Search error:', error);
            res.status(500).send({ error: 'Search failed' });
        }
    },

    getSearchProfile: async function (req, res) {
        try {
            const { idNumber } = req.query;
            const user = await UserRepository.findById(idNumber);

            if (!user) {
                return res.render('Error', { error: 'User not found' });
            }

            const details = {
                idNumber: user.idNumber,
                firstName: user.firstName,
                lastName: user.lastName,
                designation: user.designation,
                passengerType: user.passengerType,
                profilePicture: user.profilePicture === "public/images/profilepictures/Default.png" || !user.profilePicture
                    ? "images/profilepictures/Default.png"
                    : user.profilePicture
            };

            res.render('SearchProfile', details);
        } catch (error) {
            console.error('Profile search error:', error);
            res.render('Error', { error: 'Failed to retrieve profile' });
        }
    },

    getSearchReservation: async function (req, res) {
        try {
            const { idNumber } = req.query;
            const reservations = await ReservationRepository.findUserReservations(idNumber);
            res.render('SearchReservation', { 
                result: reservations, 
                idNumber 
            });
        } catch (error) {
            console.error('Reservation search error:', error);
            res.render('Error', { error: 'Failed to retrieve reservations' });
        }
    }
};

module.exports = searchController;