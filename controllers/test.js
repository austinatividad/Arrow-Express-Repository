const User = require('../models/userdb.js');
const Admin = require('../models/admindb.js');
const Reservation = require('../models/reservationdb.js');

const bcrypt = require('bcrypt');
const saltRounds = 10;

const profileController = {
    getProfile: async function (req, res) {
        if (req.session.idNumber != req.query.idNumber) {
            const result = await User.findOne({ idNumber: req.session.idNumber }, { idNumber: 1 });
            const result2 = await Admin.findOne({ idNumber: req.session.idNumber }, { idNumber: 1 });
            if (result) {
                res.status(200).redirect('/Profile?idNumber=' + req.session.idNumber);
            } else if (result2) {
                res.status(200).redirect('/ProfileAdmin?idNumber=' + req.session.idNumber);
            }
        } else {
            const result = await User.findOne(
                { idNumber: req.query.idNumber },
                'idNumber firstName lastName designation passengerType profilePicture'
            );
            if (result) {
                const details = {
                    idNumber: result.idNumber,
                    firstName: result.firstName,
                    lastName: result.lastName,
                    designation: result.designation,
                    passengerType: result.passengerType,
                    profilePicture: result.profilePicture || "images/profilepictures/Default.png"
                };
                res.render('Profile', details);
            } else {
                res.render('Error', res);
            }
        }
    },

    getProfileAdmin: async function (req, res) {
        if (req.session.idNumber != req.query.idNumber) {
            const result = await User.findOne({ idNumber: req.session.idNumber }, { idNumber: 1 });
            const result2 = await Admin.findOne({ idNumber: req.session.idNumber }, { idNumber: 1 });
            if (result) {
                res.status(200).redirect('/Profile?idNumber=' + req.session.idNumber);
            } else if (result2) {
                res.status(200).redirect('/ProfileAdmin?idNumber=' + req.session.idNumber);
            }
        } else {
            const result = await Admin.findOne(
                { idNumber: req.query.idNumber },
                'idNumber firstName lastName designation passengerType profilePicture'
            );
            if (result) {
                const details = {
                    idNumber: result.idNumber,
                    firstName: result.firstName,
                    lastName: result.lastName,
                    designation: result.designation,
                    passengerType: result.passengerType,
                    profilePicture: result.profilePicture || "public/images/profilepictures/Default.png"
                };
                res.render('ProfileAdmin', details);
            } else {
                res.render('Error', res);
            }
        }
    },

    postChangePublicInfo: async function (req, res) {
        const query = { idNumber: req.body.idNumber };
        const resultUser = await User.findOne(query, 'idNumber firstName lastName designation passengerType');
        const resultAdmin = await Admin.findOne(query, 'idNumber firstName lastName designation passengerType');

        if (resultUser && req.body.newFirstName && req.body.newLastName) {
            await User.updateOne(query, { firstName: req.body.newFirstName, lastName: req.body.newLastName });
            res.redirect(`/Profile?idNumber=${req.body.idNumber}&infoChangeSuccess=true`);
        } else if (resultAdmin && req.body.newFirstName && req.body.newLastName) {
            await Admin.updateOne(query, { firstName: req.body.newFirstName, lastName: req.body.newLastName });
            res.redirect(`/ProfileAdmin?idNumber=${req.body.idNumber}&infoChangeSuccess=true`);
        } else if ((resultUser || resultAdmin) && req.file.originalname) {
            const updateData = { profilePicture: `images/profilepictures/${req.body.idNumber}.png` };
            if (resultUser) {
                await User.updateOne(query, updateData);
                res.redirect(`/Profile?idNumber=${req.body.idNumber}&infoChangeSuccess=true`);
            } else if (resultAdmin) {
                await Admin.updateOne(query, updateData);
                res.redirect(`/ProfileAdmin?idNumber=${req.body.idNumber}&infoChangeSuccess=true`);
            }
        } else {
            res.redirect(`/Settings?idNumber=${req.body.idNumber}&infoChangeSuccess=false`);
        }
    },

    postChangePrivateInfo: async function (req, res) {
        const query = { idNumber: req.body.idNumber };
        const resultUser = await User.findOne(query, 'idNumber designation');
        const resultAdmin = await Admin.findOne(query, 'idNumber designation');

        if (resultUser) {
            await User.updateOne(query, { designation: req.body.newDesignation });
            res.redirect(`/Profile?idNumber=${req.body.idNumber}&infoChangeSuccess=true`);
        } else if (resultAdmin) {
            await Admin.updateOne(query, { designation: req.body.newDesignation });
            res.redirect(`/ProfileAdmin?idNumber=${req.body.idNumber}&infoChangeSuccess=true`);
        } else {
            res.redirect(`/Settings?idNumber=${req.body.idNumber}&infoChangeSuccess=false`);
        }
    },

    postChangePassword: async function (req, res) {
        const query = { idNumber: req.body.idNumber };
        const resultUser = await User.findOne(query, 'idNumber password');
        const resultAdmin = await Admin.findOne(query, 'idNumber password');

        if (resultUser && await bcrypt.compare(req.body.currentPassword, resultUser.password)) {
            await User.updateOne(query, { password: await bcrypt.hash(req.body.newPassword, saltRounds) });
            res.redirect(`/Profile?idNumber=${req.body.idNumber}&pwChangeSuccess=true`);
        } else if (resultAdmin && await bcrypt.compare(req.body.currentPassword, resultAdmin.password)) {
            await Admin.updateOne(query, { password: await bcrypt.hash(req.body.newPassword, saltRounds) });
            res.redirect(`/ProfileAdmin?idNumber=${req.body.idNumber}&pwChangeSuccess=true`);
        } else {
            res.redirect(`/Settings?idNumber=${req.body.idNumber}&pwChangeSuccess=false`);
        }
    },

    postDeleteAccount: async function (req, res) {
        const query = { idNumber: req.body.idNumber };
        const resultUser = await User.findOne(query, 'idNumber password');
        const resultAdmin = await Admin.findOne(query, 'idNumber password');

        if (resultUser && await bcrypt.compare(req.body.Password, resultUser.password)) {
            await User.deleteOne(query);
            await Reservation.deleteMany({ idNumber: req.body.idNumber });
            req.session.destroy(err => res.render('index', { firstName: 'Login' }));
        } else if (resultAdmin && await bcrypt.compare(req.body.Password, resultAdmin.password)) {
            await Admin.deleteOne(query);
            await Reservation.deleteMany({ idNumber: req.body.idNumber });
            req.session.destroy(err => res.render('index', { firstName: 'Login' }));
        } else {
            res.redirect(`/Settings?idNumber=${req.body.idNumber}&deleteSuccess=false`);
        }
    },

    getLogout: function (req, res) {
        req.session.destroy(err => res.redirect('/'));
    }
};

module.exports = profileController;
 






class UserRepository {
    async findById(idNumber, projection = null) {
        try {
            return await User.findOne({ idNumber }, projection);
        } catch (error) {
            console.error("Error finding user by ID:", error);
            throw new Error("Database query failed");
        }
    }

    //  and other methods...
}

module.exports = new UserRepository();


class AdminRepository {
    async findById(idNumber, projection = null) {
        try {
            return await Admin.findOne({ idNumber }, projection);
        } catch (error) {
            console.error("Error finding admin by ID:", error);
            throw new Error("Database query failed");
        }
    }

    //  and other methods...
}

module.exports = new AdminRepository();




if (buttonClicked === 'entry') {
    const reservations = await reservationRepository.findByEntry(date, location, time);
    return res.status(200).json(reservations);
} else if (buttonClicked === 'exit') {
    const reservations = await reservationRepository.findByExit(date, location, time);
    return res.status(200).json(reservations);
}

