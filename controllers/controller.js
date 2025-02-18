const UserRepository = require('../repositories/UserRepository.js');
const AdminRepository = require('../repositories/AdminRepository.js');

/*
    defines an object which contains functions executed as callback
    when a client requests for a certain path in the server
*/
const controller = {

    getIndex: async function (req, res) {

        var details = {};

        if ( req.session.idNumber ) {

            const user = await UserRepository.findById(req.session.idNumber) ?? await AdminRepository.findById(req.session.idNumber);
            if (user) {
                details = {
                    firstName: user.firstName,
                };
            }

            res.render('index', details);

        }else{
            details = {
                firstName : 'Login',
            }

            res.render('index', details);
        }
        
    },

    getLogin: function (req, res) {
        res.render('Login',res);
    },

    getSignUp: function (req, res) {
        res.render('SignUp',res);
    },
    
    getSearch: function (req, res) {
        res.render('Search', res);
    },

    getProfile: function (req, res){
        res.render('Profile', res);
    },

    getProfileAdmin: function (req, res){
        res.render('ProfileAdmin', res);
    },

    getSettings: async function (req, res){

        if ( req.session.idNumber != req.query.idNumber) {
            res.status(200).redirect('/Settings?idNumber=' + req.session.idNumber);     
        } else {

            const resultUser = await UserRepository.findById(req.session.idNumber);
            const resultAdmin = await AdminRepository.findById(req.session.idNumber);
    
            var details = {};
            
            if ( resultUser != null ) {
                details = {
                    idNumber: resultUser.idNumber,
                    firstName: resultUser.firstName,
                    lastName: resultUser.lastName,
                    designation: resultUser.designation,
                    passengerType: resultUser.passengerType,
                    isAdmin: false,
                };
            }
            else if ( resultAdmin != null ) {
                details = {
                    idNumber: resultAdmin.idNumber,
                    firstName: resultAdmin.firstName,
                    lastName: resultAdmin.lastName,
                    designation: resultAdmin.designation,
                    passengerType: resultAdmin.passengerType,
                    isAdmin: true,
                };
            }
            
            res.render('Settings', details);

        }



    },

    getSchedule: function (req, res){
        res.render('Schedule', res);
    },

    getReservation: function (req, res){
        res.render('Reservation', res);
    },

    getReservationAdmin: function (req, res){
        res.render('ReservationAdmin', res);
    },

    getError: function (req, res) {
        res.render('Error', res);
    },

}

/*
    exports the object `controller` (defined above)
    when another script exports from this file
*/
module.exports = controller;
