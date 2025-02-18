// import module from `../models/db.js`
const db = require('../models/db.js');

const User = require('../models/userdb.js');

const Admin = require('../models/admindb.js');

/*
    defines an object which contains functions executed as callback
    when a client requests for a certain path in the server
*/
const controller = {

    getIndex: async function (req, res) {

        var details = {};

        if ( req.session.idNumber ) {

            const query = { idNumber: req.session.idNumber };
            const projection = { firstName: 1};
            const result = await db.findOne(User, query, projection);
            const result2 = await db.findOne(Admin, query, projection);

            if (result) {
                details = {
                    firstName : result.firstName,
                };
            } else if (result2) {
                details = {
                    firstName : result2.firstName,
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

            var query = {idNumber: req.query.idNumber};
            const projection = 'idNumber firstName lastName designation passengerType';
    
            const resultUser = await db.findOne(User, query, projection);
            const resultAdmin = await db.findOne(Admin, query, projection);
    
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
