const db = require('../models/db.js');

const { validationResult } = require('express-validator');

// import module `bcrypt`
const bcrypt = require('bcrypt');
const saltRounds = 10;

const User = require('../models/userdb.js');

const Admin = require('../models/admindb.js');

const signupController = {

    getSignUp: function (req, res) {
        res.render('SignUp',res);
    },

    postSignUp: async function (req, res) {

        var errors = validationResult(req);

        if ( !errors.isEmpty()){
            errors = errors.errors;

            var details = {};
            for ( var i = 0; i < errors.length; i++ ){
                details[errors[i].path + 'Error'] = errors[i].msg;
            }

            res.render('SignUp', details);
        }else{

            const user = {
                firstName: req.body.user_firstName,
                lastName: req.body.user_lastName,
                email: req.body.user_email,
                idNumber: req.body.user_idNumber,
                password: await bcrypt.hash(req.body.user_password, saltRounds),
                securityCode: await bcrypt.hash(req.body.user_securityCode, saltRounds),
                designation: req.body.user_designation,
                passengerType: req.body.user_passengerType,
                profilePicture: "images/profilepictures/Default.png"
            }
    
            var result = await db.insertOne(User, user);
    
            if( result ){
                console.log(result);
                console.log('User successfully added');
                res.render('Login', {isRegistered: true});
            }
            else{
                console.log('User not added');
            }

        }
        
    },

    getCheckID: async function (req, res) {

        
        var idNumber = req.query.idNumber;
        var result = await db.findOne(User, {idNumber: idNumber});
        var result2 = await db.findOne(Admin, {idNumber: idNumber});
        if ( result ){
            res.send(result);
        }else if (result2) {
            res.send(result2);
        }else{
            res.send(null);
        }
        
    },

    getCheckEmail: async function (req, res) {

        var email = req.query.email;
        var result = await db.findOne(User, {email: email}, 'email');
        var result2 = await db.findOne(Admin, {email: email}, 'email');
        if ( result ){
            res.send(result);
        }else if (result2) {
            res.send(result2);
        }else{
            res.send(null);
        }

    },

}

module.exports = signupController;
