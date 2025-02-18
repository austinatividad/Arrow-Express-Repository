const UserRepository = require('../repositories/UserRepository.js');
const AdminRepository = require('../repositories/AdminRepository.js');
const { validationResult } = require('express-validator');

const signupController = {
    getSignUp: function (req, res) {
        res.render('SignUp');
    },

    postSignUp: async function (req, res) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                const details = {};
                for (const error of errors.errors) {
                    details[error.path + 'Error'] = error.msg;
                }
                return res.render('SignUp', details);
            }

            const { 
                user_firstName: firstName,
                user_lastName: lastName,
                user_email: email,
                user_idNumber: idNumber,
                user_password: password,
                user_securityCode: securityCode,
                user_designation: designation,
                user_passengerType: passengerType
            } = req.body;

            // Check if user already exists
            const existingUser = await UserRepository.findById(idNumber);
            const existingAdmin = await AdminRepository.findById(idNumber);

            if (existingUser || existingAdmin) {
                return res.render('SignUp', { 
                    error: 'Account with this ID already exists',
                    signupSuccess: false
                });
            }

            // Create new user account
            await UserRepository.createUser({
                idNumber,
                firstName,
                lastName,
                email,
                designation,
                passengerType,
                password,
                securityCode,
                profilePicture: "public/images/profilepictures/Default.png"
            });

            res.render('Login', { isRegistered: true });
        } catch (error) {
            console.error('Signup error:', error);
            res.render('SignUp', { 
                error: error.message || 'Failed to create account',
                signupSuccess: false
            });
        }
    },

    getCheckID: async function (req, res) {
        try {
            const { idNumber } = req.query;
            const user = await UserRepository.findById(idNumber);
            const admin = await AdminRepository.findById(idNumber);

            if (user) {
                res.send(user);
            } else if (admin) {
                res.send(admin);
            } else {
                res.send(null);
            }
        } catch (error) {
            console.error('Check ID error:', error);
            res.status(500).send(null);
        }
    },

    getCheckEmail: async function (req, res) {
        try {
            const { email } = req.query;
            const user = await UserRepository.findByEmail(email);
            const admin = await AdminRepository.findByEmail(email);

            if (user) {
                res.send(user);
            } else if (admin) {
                res.send(admin);
            } else {
                res.send(null);
            }
        } catch (error) {
            console.error('Check email error:', error);
            res.status(500).send(null);
        }
    }
};

module.exports = signupController;
