const Reservation = require('../models/reservationdb.js');

const scheduleController = {
    getReservations: async (req, res) => {
      try {
        const { date, location, time } = req.params;
        const { buttonClicked } = req.query;
        if(buttonClicked=== 'entry') {

            const reservations = await Reservation.find({
                date,
                entryLoc: location,
                entryTime: time,
              });
            return res.status(200).json(reservations);
        }

        else if (buttonClicked=== 'exit') {

            const { date, location, time } = req.params;
            const reservations = await Reservation.find ({
                date, 
                exitLoc: location,
                exitTime: time,
            });
            return res.status(200).json(reservations);
        }

      } catch (err) {
        console.error('Error retrieving reservations:', err);
        return res.status(500).json({ error: 'Failed to retrieve reservations' });
      }
    },
};

module.exports = scheduleController;