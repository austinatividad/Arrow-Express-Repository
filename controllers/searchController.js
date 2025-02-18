const db = require('../models/db.js');

const User = require('../models/userdb.js');

const Reservation = require('../models/reservationdb.js');

const searchController = {

    getSearch : function (req, res) {
        res.render('Search', res);
    },

    postUserSearch : async function (req, res) {
        let payload = req.body.payload.trim();
        let search = await User.find(
            {
              $or: [
                { firstName: { $regex: new RegExp('^' + payload + '.*', 'i') } },
                { lastName: { $regex: new RegExp('^' + payload + '.*', 'i') } },
                { $expr: { $regexMatch: { input: { $concat: ['$firstName', ' ', '$lastName'] }, regex: new RegExp('^' + payload + '.*', 'i') } } },
                { passengerType: { $regex: new RegExp('^' + payload + '.*', 'i') } },
                { idNumber: parseInt(payload) || 0 },
                { profilePictre: { $regex: new RegExp('^' + payload + '.*', 'i') } }
              ]
            },
            'firstName lastName "$expr" passengerType idNumber profilePicture'
          ).exec();

        search = search.slice(0, 10);
        res.send({payload: search});
    },

    getSearchProfile : async function (req, res) {
      const query = {idNumber: req.query.idNumber};
      
        const projection = 'idNumber firstName lastName designation passengerType profilePicture';
      
        const result = await db.findOne(User, query, projection);
      
        if (result != null) {
      
          const details = {
            idNumber: result.idNumber,
            firstName: result.firstName,
            lastName: result.lastName,
            designation: result.designation,
            passengerType: result.passengerType
          };

          if ( result.profilePicture == "public/images/profilepictures/Default.png" || result.profilePicture == null) {
            details.profilePicture = "images/profilepictures/Default.png"
          }
          else if ( result.profilePicture != "public/images/profilepictures/Default.png") {
            details.profilePicture = result.profilePicture;
          }
          else{
            details.profilePicture = "images/profilepictures/Default.png";
          }
      
          res.render('SearchProfile', details);
          
        } else {
          res.render('Error',res);
        }

    },

    getSearchReservation : async function (req, res) {

        var userID = req.query.idNumber;

		    const result = await db.findMany(Reservation, {idNumber: userID}, {_id:0, __v:0});

        res.render('SearchReservation', {result: result, idNumber: userID});

    }

};

module.exports = searchController;