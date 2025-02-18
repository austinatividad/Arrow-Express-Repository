const db = require('../models/db.js');

const bcrypt = require('bcrypt');

const User = require('../models/userdb.js');

const Admin = require('../models/admindb.js');

const loginController = {

    getLogin: async function (req, res) {

        if ( req.session.idNumber ){

          const query = { idNumber: req.session.idNumber };
          const projection = { idNumber: 1 };
          const result = await db.findOne(User, query, projection);
          const result2 = await db.findOne(Admin, query, projection);

          if (result) {
            res.status(200).redirect('/Profile?idNumber=' + req.session.idNumber);     
          } else if (result2) {
            res.status(200).redirect('/ProfileAdmin?idNumber=' + req.session.idNumber);  
          } else {
            res.render('Login', { isValid: false })
          }

        }
        else{
          res.render('Login');
        }
        
    },
    
    postLogin: async function (req, res) {
        const idNumber = req.body.user_idNumber;
        const password = req.body.user_password;

        try {
          const query = { idNumber: idNumber };
          const projection = { idNumber: 1, password: 1};
          const result = await db.findOne(User, query, projection);
          const result2 = await db.findOne(Admin, query, projection);
          
          if (result && await bcrypt.compare(password, result.password)) {

            req.session.idNumber = result.idNumber;

            res.redirect('/SecurityCheck?idNumber=' + idNumber);      
          } else if (result2 && await bcrypt.compare(password, result2.password)) {
          
            req.session.idNumber = result2.idNumber;

            res.redirect('/SecurityCheck?idNumber=' + idNumber);

          } else {
            res.render('Login', { isValid: false })
          }
              
          } catch (err) {
            res.status(500).send(err);
          }
        },

};

module.exports = loginController;
