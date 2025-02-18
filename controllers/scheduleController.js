const ReservationRepository = require('../repositories/ReservationRepository.js');

const scheduleController = {
    getReservations: async (req, res) => {
        try {
            const { date, location, time } = req.params;
            const { buttonClicked } = req.query;

            let reservations;
            if (buttonClicked === 'entry') {
                reservations = await ReservationRepository.findEntryReservations(date, location, time);
            } else if (buttonClicked === 'exit') {
                reservations = await ReservationRepository.findExitReservations(date, location, time);
            } else {
                return res.status(400).json({ error: 'Invalid button type' });
            }

            return res.status(200).json(reservations);
        } catch (error) {
            console.error('Error retrieving reservations:', error);
            return res.status(500).json({ error: 'Failed to retrieve reservations' });
        }
    }
};

module.exports = scheduleController;