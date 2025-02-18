const db = require('../models/db.js');

const User = require('../models/userdb.js');

const Admin = require('../models/admindb.js');

const Reservation = require('../models/reservationdb.js');

// import module `bcrypt`
const bcrypt = require('bcrypt');
const saltRounds = 10;

const profileController = {
    getProfile: async function (req, res) {
      if ( req.session.idNumber != req.query.idNumber ) {
        const query = { idNumber: req.session.idNumber };
        const projection = { idNumber: 1 };
        const result = await db.findOne(User, query, projection);
        const result2 = await db.findOne(Admin, query, projection);
        if (result) {
          res.status(200).redirect('/Profile?idNumber=' + req.session.idNumber);     
        } else if (result2) {
          res.status(200).redirect('/ProfileAdmin?idNumber=' + req.session.idNumber);  
        }
      }
      else{
        const query = {idNumber: req.query.idNumber};
        const projection = 'idNumber firstName lastName designation passengerType profilePicture';
        const result = await db.findOne(User, query, projection);
      
        if (result != null) {
          const details = {
            idNumber: result.idNumber,
            firstName: result.firstName,
            lastName: result.lastName,
            designation: result.designation,
            passengerType: result.passengerType
          };

          if ( result.profilePicture == "public/images/profilepictures/Default.png" || result.profilePicture == null) {
            details.profilePicture = "images/profilepictures/Default.png"
          }
          else if ( result.profilePicture != "public/images/profilepictures/Default.png") {
            details.profilePicture = result.profilePicture;
          }
          else{
            details.profilePicture = "images/profilepictures/Default.png";
          }
      
          res.render('Profile', details);
          
        } else {
          res.render('Error',res);
        }
      }
        
    },

    getProfileAdmin: async function (req, res) {

      if ( req.session.idNumber != req.query.idNumber ) {
        const query = { idNumber: req.session.idNumber };
        const projection = { idNumber: 1 };
        const result = await db.findOne(User, query, projection);
        const result2 = await db.findOne(Admin, query, projection);
        if (result) {
          res.status(200).redirect('/Profile?idNumber=' + req.session.idNumber);     
        } else if (result2) {
          res.status(200).redirect('/ProfileAdmin?idNumber=' + req.session.idNumber);  
        }
      }
      else{
        var query = {idNumber: req.query.idNumber};
        var projection = 'idNumber firstName lastName designation passengerType profilePicture';

        const result = await db.findOne(Admin, query, projection);
        
        if (result != null) {

            const details = {
                idNumber: result.idNumber,
                firstName: result.firstName,
                lastName: result.lastName,
                designation: result.designation,
                passengerType: result.passengerType
            };

            if ( result.profilePicture == "public/images/profilepictures/Default.png" ) {
              details.profilePicture = "public/images/profilepictures/Default.png"
            }
            else if ( result.profilePicture != "public/images/profilepictures/Default.png") {
              details.profilePicture = result.profilePicture;
            }
            else{
              details.profilePicture = "public/images/profilepictures/Default.png";
            }

            res.render('ProfileAdmin', details);
        }
        else {
            res.render('Error',res);
        }
        
      }

    },

    postChangePublicInfo: async function (req, res) {
      var query = {idNumber: req.body.idNumber };
      const projection = { idNumber: 1, firstName: 1, lastName: 1, designation: 1, passengerType: 1 };

      const resultUser = await db.findOne(User, query, projection);
      const resultAdmin = await db.findOne(Admin, query, projection);

      if (resultUser != null && (req.body.newFirstName != "" && req.body.newLastName != "") ) {
        await User.updateOne(query, {firstName: req.body.newFirstName, lastName: req.body.newLastName})
        console.log("User public info change successful");
        res.redirect('/Profile?idNumber=' + req.body.idNumber + '&infoChangeSuccess=true');
      }
      else if (resultAdmin != null && (req.body.newFirstName != "" && req.body.newLastName != "") ) {
        await Admin.updateOne(query, {firstName: req.body.newFirstName, lastName: req.body.newLastName})
        console.log("Admin user public info change successful");
        res.redirect('/ProfileAdmin?idNumber=' + req.body.idNumber + '&infoChangeSuccess=true');
      } 
      else if ( ( resultUser != null || resultAdmin != null ) && req.file.originalname != null ){

        if ( resultUser ){
          await User.updateOne(query, {profilePicture: "images/profilepictures/" + req.body.idNumber + ".png"})
          res.redirect('/Profile?idNumber=' + req.body.idNumber + '&infoChangeSuccess=true');
        }
        else if ( resultAdmin ){
          await Admin.updateOne(query, {profilePicture: "images/profilepictures/" + req.body.idNumber + ".png"})
          res.redirect('/ProfileAdmin?idNumber=' + req.body.idNumber + '&infoChangeSuccess=true');
        }

      }
      else {
        console.log("User/Admin public info change unsuccessful");
        res.redirect('/Settings?idNumber=' + req.body.idNumber + '&infoChangeSuccess=false');
      }
     

    },

    postChangePrivateInfo: async function (req, res) {
      var query = {idNumber: req.body.idNumber };
      const projection = { idNumber: 1, designation: 1};

      const resultUser = await db.findOne(User, query, projection);
      const resultAdmin = await db.findOne(Admin, query, projection);
     
      if (resultUser != null ) {
        await User.updateOne(query, {designation: req.body.newDesignation})
        console.log("User private info change successful");
        res.redirect('/Profile?idNumber=' + req.body.idNumber + '&infoChangeSuccess=true');
      }
      else if (resultAdmin != null ) {
        await Admin.updateOne(query, {designation: req.body.newDesignation})
        console.log("Admin user private info change successful");
        res.redirect('/ProfileAdmin?idNumber=' + req.body.idNumber + '&infoChangeSuccess=true');
      }
      else {
        console.log("User/Admin private info change unsuccessful");
        res.redirect('/Settings?idNumber=' + req.body.idNumber + '&infoChangeSuccess=false');
      }

    },

    postChangePassword: async function (req, res) {
      var query = {idNumber: req.body.idNumber};
      const projection = { idNumber: 1, password: 1 };

      const resultUser = await db.findOne(User, query, projection);
      const resultAdmin = await db.findOne(Admin, query, projection);

      if (resultUser != null && await bcrypt.compare(req.body.currentPassword, resultUser.password) ) {
        await User.updateOne(query, {password: await bcrypt.hash(req.body.newPassword, saltRounds)})
        console.log("User password change successful");
        res.redirect('/Profile?idNumber=' + req.body.idNumber + '&pwChangeSuccess=true');
      }
      else if (resultAdmin != null && await bcrypt.compare(req.body.currentPassword, resultAdmin.password)) {
        await Admin.updateOne(query, {password: await bcrypt.hash(req.body.newPassword, saltRounds)} )
        console.log("Admin user password change successful");
        res.redirect('/ProfileAdmin?idNumber=' + req.body.idNumber + '&pwChangeSuccess=true');
      }
      else {
        console.log("User/Admin password change unsuccessful");
        res.redirect('/Settings?idNumber=' + req.body.idNumber + '&pwChangeSuccess=false');
      }

    },

    postChangeCode: async function (req, res) {
      
      var query = {idNumber: req.body.idNumber};
      const projection = { idNumber: 1, securityCode: 1 };
    
      const resultUser = await db.findOne(User, query, projection);
      const resultAdmin = await db.findOne(Admin, query, projection);

      if (resultUser != null && await bcrypt.compare(req.body.currentSecCode, resultUser.securityCode)) {
        await User.updateOne(query, {securityCode: await bcrypt.hash(req.body.newSecCode, saltRounds)});
        console.log("User code change successful");
        res.redirect('/Profile?idNumber=' + req.body.idNumber + '&codeChangeSuccess=true');
      }
      else if (resultAdmin != null && await bcrypt.compare(req.body.currentSecCode, resultAdmin.securityCode)) {
        await Admin.updateOne(query, {securityCode: await bcrypt.hash(req.body.newSecCode, saltRounds)});
        console.log("User code change successful");
        res.redirect('/ProfileAdmin?idNumber=' + req.body.idNumber + '&codeChangeSuccess=true');
      }
      else {
        console.log(req.body.currentSecCode);
        console.log(req.body.newSecCode);
        
        console.log("User/Admin security code change unsuccessful");
        res.redirect('/Settings?idNumber=' + req.body.idNumber + '&codeChangeSuccess=false');
      }

    },

    postDeleteAccount: async function (req, res) {
      var query = {idNumber: req.body.idNumber};
      const projection = { idNumber: 1, password: 1 };
    
      const resultUser = await db.findOne(User, query, projection);
      const resultAdmin = await db.findOne(Admin, query, projection);

      var details = {};
  
      if (resultUser != null && await bcrypt.compare(req.body.Password, resultUser.password) ) {
        await User.deleteOne(query);
        await Reservation.deleteMany(query);

        details = {
          firstName : 'Login',
        }
        
        req.session.destroy(function(err) {
          if(err) throw err;
          res.render('index', details);
        });
        
      }
      else if (resultAdmin != null && await bcrypt.compare(req.body.Password, resultAdmin.password) ) {
        await Admin.deleteOne(query);
        await Reservation.deleteMany(query);
        console.log("Admin user deleted");

        details = {
          firstName : 'Login',
        }
        
        req.session.destroy(function(err) {
          if(err) throw err;
          res.render('index', details);
        });

      }
      else {
        console.log("User/Admin not deleted");
        res.redirect('/Settings?idNumber=' + req.body.idNumber + '&deleteSuccess=false');
      }

    },

    getLogout: function (req, res) {
      req.session.destroy(function(err) {
        if(err) throw err;
        res.redirect('/');
      });
    }
    
}

module.exports = profileController;
