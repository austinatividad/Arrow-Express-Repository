const UserRepository = require('../repositories/UserRepository.js');
const AdminRepository = require('../repositories/AdminRepository.js');

const securityController = {
    getSecurity: async function (req, res) {
        try {
            const { idNumber } = req.query;
            
            const user = await UserRepository.findById(idNumber);
            const admin = await AdminRepository.findById(idNumber);

            if (user || admin) {
                return res.render('Security', { 
                    idNumber,
                    isAdmin: !!admin 
                });
            }

            res.render('Error', { error: 'Account not found' });
        } catch (error) {
            console.error('Security page error:', error);
            res.render('Error', { error: 'Failed to load security page' });
        }
    },

    postVerifySecurityCode: async function (req, res) {
        try {
            const { idNumber, user_securityCode: securityCode } = req.body;

            const user = await UserRepository.findById(idNumber);
            if (user) {
                const isValid = await UserRepository.verifySecurityCode(idNumber, securityCode);
                if (isValid) {
                    return res.redirect('/ChangePassword?idNumber=' + idNumber);
                }
                return res.render('Security', { 
                    idNumber, 
                    error: 'Invalid security code',
                    verifySuccess: false 
                });
            }

            const admin = await AdminRepository.findById(idNumber);
            if (admin) {
                const isValid = await AdminRepository.verifySecurityCode(idNumber, securityCode);
                if (isValid) {
                    return res.redirect('/ChangePasswordAdmin?idNumber=' + idNumber);
                }
                return res.render('Security', { 
                    idNumber, 
                    error: 'Invalid security code',
                    verifySuccess: false,
                    isAdmin: true
                });
            }

            res.render('Error', { error: 'Account not found' });
        } catch (error) {
            console.error('Security verification error:', error);
            res.render('Error', { error: 'Failed to verify security code' });
        }
    }
};

module.exports = securityController;
