const UserRepository = require('../repositories/UserRepository.js');
const AdminRepository = require('../repositories/AdminRepository.js');

const forgotPassController = {

    getForgotPassword: function (req, res) {
        res.render('ForgotPassword', res);
    },

    postForgotPassword: async function (req, res){

        const resultUser = await UserRepository.findByEmailAndSecurityCode(req.body.user_email, req.body.user_securityCode);
        const resultAdmin = await AdminRepository.findByEmailAndSecurityCode(req.body.user_email, req.body.user_securityCode);

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
            const resultUser = await UserRepository.findByEmailAndSecurityCode(req.body.user_email, req.body.user_securityCode);
            const resultAdmin = await AdminRepository.findByEmailAndSecurityCode(req.body.user_email, req.body.user_securityCode);

            if ( resultUser != null ) {
                await UserRepository.updateUserPassword(req.body.idNumber, req.body.user_newPassword1)
                console.log("Change password successful");
                res.render('Login', { codeChange: true } );
            }
            else if ( resultAdmin != null ) {
                await AdminRepository.updateAdminPassword(req.body.idNumber, req.body.user_newPassword1)
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