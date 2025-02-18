const UserRepository = require('../repositories/UserRepository.js');
const AdminRepository = require('../repositories/AdminRepository.js');
const ReservationRepository = require('../repositories/ReservationRepository.js');

const profileController = {
    getProfile: async function (req, res) {
        try {
            if (req.session.idNumber != req.query.idNumber) {
                const user = await UserRepository.findById(req.session.idNumber);
                const admin = await AdminRepository.findById(req.session.idNumber);
                
                if (user) {
                    return res.status(200).redirect('/Profile?idNumber=' + req.session.idNumber);     
                } else if (admin) {
                    return res.status(200).redirect('/ProfileAdmin?idNumber=' + req.session.idNumber);  
                }
            } else {
                const user = await UserRepository.findById(req.query.idNumber);
                
                if (user) {
                    const details = {
                        idNumber: user.idNumber,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        designation: user.designation,
                        passengerType: user.passengerType,
                        profilePicture: user.profilePicture === "public/images/profilepictures/Default.png" || !user.profilePicture
                            ? "images/profilepictures/Default.png"
                            : user.profilePicture
                    };
                    
                    return res.render('Profile', details);
                }
            }
            res.render('Error', res);
        } catch (error) {
            console.error('Profile retrieval error:', error);
            res.status(500).render('Error', { error: 'Failed to retrieve profile' });
        }
    },

    getProfileAdmin: async function (req, res) {
        try {
            if (req.session.idNumber != req.query.idNumber) {
                const user = await UserRepository.findById(req.session.idNumber);
                const admin = await AdminRepository.findById(req.session.idNumber);
                
                if (user) {
                    return res.status(200).redirect('/Profile?idNumber=' + req.session.idNumber);     
                } else if (admin) {
                    return res.status(200).redirect('/ProfileAdmin?idNumber=' + req.session.idNumber);  
                }
            } else {
                const admin = await AdminRepository.findById(req.query.idNumber);
                
                if (admin) {
                    const details = {
                        idNumber: admin.idNumber,
                        firstName: admin.firstName,
                        lastName: admin.lastName,
                        designation: admin.designation,
                        passengerType: admin.passengerType,
                        profilePicture: admin.profilePicture === "public/images/profilepictures/Default.png" || !admin.profilePicture
                            ? "images/profilepictures/Default.png"
                            : admin.profilePicture
                    };
                    
                    return res.render('ProfileAdmin', details);
                }
            }
            res.render('Error', res);
        } catch (error) {
            console.error('Admin profile retrieval error:', error);
            res.status(500).render('Error', { error: 'Failed to retrieve admin profile' });
        }
    },

    postChangePublicInfo: async function (req, res) {
        try {
            const { idNumber, newFirstName, newLastName } = req.body;
            const updateData = {};

            if (newFirstName && newLastName) {
                updateData.firstName = newFirstName;
                updateData.lastName = newLastName;
            }

            if (req.file?.originalname) {
                updateData.profilePicture = `images/profilepictures/${idNumber}.png`;
            }

            if (Object.keys(updateData).length === 0) {
                return res.redirect('/Settings?idNumber=' + idNumber + '&infoChangeSuccess=false');
            }

            const user = await UserRepository.findById(idNumber);
            if (user) {
                await UserRepository.updateProfile(idNumber, updateData);
                return res.redirect('/Profile?idNumber=' + idNumber + '&infoChangeSuccess=true');
            }

            const admin = await AdminRepository.findById(idNumber);
            if (admin) {
                await AdminRepository.updateProfile(idNumber, updateData);
                return res.redirect('/ProfileAdmin?idNumber=' + idNumber + '&infoChangeSuccess=true');
            }

            res.redirect('/Settings?idNumber=' + idNumber + '&infoChangeSuccess=false');
        } catch (error) {
            console.error('Public info update error:', error);
            res.redirect('/Settings?idNumber=' + req.body.idNumber + '&infoChangeSuccess=false');
        }
    },

    postChangePrivateInfo: async function (req, res) {
        try {
            const { idNumber, newDesignation } = req.body;
            const updateData = { designation: newDesignation };

            const user = await UserRepository.findById(idNumber);
            if (user) {
                await UserRepository.updateProfile(idNumber, updateData);
                return res.redirect('/Profile?idNumber=' + idNumber + '&infoChangeSuccess=true');
            }

            const admin = await AdminRepository.findById(idNumber);
            if (admin) {
                await AdminRepository.updateProfile(idNumber, updateData);
                return res.redirect('/ProfileAdmin?idNumber=' + idNumber + '&infoChangeSuccess=true');
            }

            res.redirect('/Settings?idNumber=' + idNumber + '&infoChangeSuccess=false');
        } catch (error) {
            console.error('Private info update error:', error);
            res.redirect('/Settings?idNumber=' + req.body.idNumber + '&infoChangeSuccess=false');
        }
    },

    postChangePassword: async function (req, res) {
        try {
            const { idNumber, currentPassword, newPassword } = req.body;

            const user = await UserRepository.findById(idNumber);
            if (user) {
                await UserRepository.updatePassword(idNumber, currentPassword, newPassword);
                return res.redirect('/Profile?idNumber=' + idNumber + '&pwChangeSuccess=true');
            }

            const admin = await AdminRepository.findById(idNumber);
            if (admin) {
                await AdminRepository.updatePassword(idNumber, currentPassword, newPassword);
                return res.redirect('/ProfileAdmin?idNumber=' + idNumber + '&pwChangeSuccess=true');
            }

            res.redirect('/Settings?idNumber=' + idNumber + '&pwChangeSuccess=false');
        } catch (error) {
            console.error('Password change error:', error);
            res.redirect('/Settings?idNumber=' + req.body.idNumber + '&pwChangeSuccess=false');
        }
    },

    postChangeCode: async function (req, res) {
        try {
            const { idNumber, currentSecCode: currentCode, newSecCode: newCode } = req.body;

            const user = await UserRepository.findById(idNumber);
            if (user) {
                await UserRepository.updateSecurityCode(idNumber, currentCode, newCode);
                return res.redirect('/Profile?idNumber=' + idNumber + '&codeChangeSuccess=true');
            }

            const admin = await AdminRepository.findById(idNumber);
            if (admin) {
                await AdminRepository.updateSecurityCode(idNumber, currentCode, newCode);
                return res.redirect('/ProfileAdmin?idNumber=' + idNumber + '&codeChangeSuccess=true');
            }

            res.redirect('/Settings?idNumber=' + idNumber + '&codeChangeSuccess=false');
        } catch (error) {
            console.error('Security code change error:', error);
            res.redirect('/Settings?idNumber=' + req.body.idNumber + '&codeChangeSuccess=false');
        }
    },

    postDeleteAccount: async function (req, res) {
        try {
            const { idNumber, Password: password } = req.body;

            const user = await UserRepository.findById(idNumber);
            if (user) {
                await UserRepository.deleteAccount(idNumber, password);
                await ReservationRepository.deleteAllReservations(idNumber);
                req.session.destroy();
                return res.render('Login', { accountDeleted: true });
            }

            const admin = await AdminRepository.findById(idNumber);
            if (admin) {
                await AdminRepository.deleteAccount(idNumber, password);
                await ReservationRepository.deleteAllReservations(idNumber);
                req.session.destroy();
                return res.render('Login', { accountDeleted: true });
            }

            res.render('Settings', { 
                idNumber: idNumber,
                deleteAccountSuccess: false,
                error: 'Account not found'
            });
        } catch (error) {
            console.error('Account deletion error:', error);
            res.render('Settings', { 
                idNumber: req.body.idNumber,
                deleteAccountSuccess: false,
                error: error.message
            });
        }
    },

    getLogout: async function (req, res) {
        req.session.destroy();
        res.redirect('/Login');
    }
};

module.exports = profileController;
