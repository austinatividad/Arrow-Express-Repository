const db = require('../models/db.js');

const User = require('../models/userdb.js');

const Admin = require('../models/admindb.js');

const forgotPassController = {

    getForgotPassword: function (req, res) {
        res.render('ForgotPassword', res);
    },

    postForgotPassword: async function (req, res){

        var query = {email: req.body.user_email, securityCode: req.body.user_securityCode};

        const resultUser = await db.findOne(User, query, 'idNumber email securityCode');
        const resultAdmin = await db.findOne(Admin, query, 'idNumber email securityCode');

        var details = {};

        if ( resultUser != null && (resultUser.email == req.body.user_email && resultUser.securityCode == req.body.user_securityCode) ) {
            console.log('User email and security code match.');

            details = {
                idNumber: resultUser.idNumber,
                email: resultUser.email,
                securityCode: resultUser.securityCode
            }

            res.render('ForgotPassword', details);
        }
        else if ( resultAdmin != null && (resultAdmin.email == req.body.user_email && resultAdmin.securityCode == req.body.user_securityCode) ) {
            console.log('Admin email and security code match.');

            details = {
                idNumber: resultAdmin.idNumber,
                email: resultAdmin.email,
                securityCode: resultAdmin.securityCode
            }
            res.render('ForgotPassword', details);
        }
        else{
            res.render('ForgotPassword', { isInvalid: true });
        }

    },

    postChangeFPassword: async function (req, res){

        var newPassword0 = req.body.user_newPassword0;
        var newPassword1 = req.body.user_newPassword1;

        if ( newPassword0 == newPassword1 ){

            var query = {idNumber: req.body.idNumber};
            const projection = { idNumber: 1, password: 1};

            const resultUser = await db.findOne(User, query, projection);
            const resultAdmin = await db.findOne(Admin, query, projection);

            if ( resultUser != null ) {
                await User.updateOne(query, {password: req.body.user_newPassword1})
                console.log("Change password successful");
                res.render('Login', { codeChange: true } );
            }
            else if ( resultAdmin != null ) {
                await Admin.updateOne(query, {password: req.body.user_newPassword1})
                console.log("Change password successful");
                res.render('Login', { codeChange: true } );
            } else {
                console.log("User/Admin password change unsuccessful. No user/admin found.");
                res.render('ForgotPassword', res);
            }

        }
        else{
            res.render('ForgotPassword', { isMatch: false, idNumber: req.body.idNumber } );
        }

        

    }
}

module.exports = forgotPassController;