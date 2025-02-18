const UserRepository = require('../repositories/UserRepository.js');
const AdminRepository = require('../repositories/AdminRepository.js');

const loginController = {
    getLogin: async function (req, res) {
        if (req.session.idNumber) {
            const user = await UserRepository.findById(req.session.idNumber);
            const admin = await AdminRepository.findById(req.session.idNumber);

            if (user) {
                res.status(200).redirect('/Profile?idNumber=' + req.session.idNumber);     
            } else if (admin) {
                res.status(200).redirect('/ProfileAdmin?idNumber=' + req.session.idNumber);  
            } else {
                res.render('Login', { isValid: false })
            }
        } else {
            res.render('Login');
        }
    },
    
    postLogin: async function (req, res) {
        const idNumber = req.body.user_idNumber;
        const password = req.body.user_password;

        try {
            const user = await UserRepository.verifyPassword(idNumber, password);
            const admin = await AdminRepository.verifyPassword(idNumber, password);
            
            if (user) {
                req.session.idNumber = user.idNumber;
                res.redirect('/SecurityCheck?idNumber=' + idNumber);      
            } else if (admin) {
                req.session.idNumber = admin.idNumber;
                res.redirect('/SecurityCheck?idNumber=' + idNumber);
            } else {
                res.render('Login', { isValid: false })
            }
        } catch (err) {
            console.error('Login error:', err);
            res.status(500).send(err);
        }
    }
};

module.exports = loginController;
