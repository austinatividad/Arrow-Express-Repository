const db = require('../models/db.js');

const User = require('../models/userdb.js');

const Admin = require('../models/admindb.js');

// import module `bcrypt`
const bcrypt = require('bcrypt');

const securityController = {

    getSecurity: async function (req, res) {

        const query = {idNumber: req.query.idNumber};

        const projection = 'idNumber';
      
        const result = await db.findOne(User, query, projection);
        const result2 = await db.findOne(Admin, query, projection);

        var details = {};

        if ( result != null ){
            details = {
              idNumber: result.idNumber
            }
        } else if (result2 != null) {
            details = {
              idNumber: result2.idNumber
            }
        } else {
          console.log('User does not exist.');
        }
          
        
        
        res.render('Security', details);
    },

    postSecurity: async function (req, res) {

        const idNumber = req.body.idNumber;
        const securityCode = req.body.user_securityCode;
      
        try {
          const query = { idNumber: idNumber };
          const projection = { idNumber: 1, securityCode: 1};
          const result = await db.findOne(User, query, projection);
          const result2 = await db.findOne(Admin, query, projection);

          if (result != null && await bcrypt.compare(securityCode, result.securityCode)) 
			res.status(200).redirect('/Profile?idNumber=' + idNumber);
          else if ( result2 != null && await bcrypt.compare(securityCode, result2.securityCode))
			res.status(200).redirect('/ProfileAdmin?idNumber=' + idNumber);
          else
            res.render('Login', { isCodeCorrect: false });
		
        } catch (err) {
          res.status(500).send(err);
        }
    }
}

module.exports = securityController;
