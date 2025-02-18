const db = require('../models/db.js');

const User = require('../models/userdb.js');

const Admin = require('../models/admindb.js');

const Reservation = require('../models/reservationdb.js');

const reservationController = {

    getReservations: async function (req, res) {
		
		if ( req.session.idNumber != req.query.idNumber ) {
			res.redirect('/Reservation?idNumber=' + req.session.idNumber );
		}else{
			var userID = req.query.idNumber;
			const query = { idNumber: userID };
			const projection = { idNumber: 1 };
			
			const isAdmin = await db.findOne(Admin, query, projection);
	
			const result = await db.findMany(Reservation, {idNumber: userID}, {_id:0, __v:0});
	
			if ( isAdmin != null ) {
				res.render('Reservation', {displayUI: 1, result: result, idNumber: userID, isAdmin: true});
			} else {
				res.render('Reservation', {displayUI: 0, result: result, idNumber: userID, isAdmin: false});
			}
		}

		
    },

    getReservationAdmin: async function (req, res) {

		if ( req.session.idNumber != req.query.idNumber ){

			var userID = req.session.idNumber;
			const query = { idNumber: userID };
			const projection = { idNumber: 1 };

			const isAdmin = await db.findOne(Admin, query, projection);

			if ( isAdmin != null ){
				res.redirect('/ReservationAdmin?idNumber=' + req.session.idNumber );
			}else{
				res.render('Error');
			}
			
		}else{
			var userID = req.query.idNumber;

			const details = {
				idNumber: userID,
			}
	
			res.render('ReservationAdmin', details);
		}

    },

	//Add reservation
	postReservations: async function (req, res) {
        /*
            when submitting forms using HTTP POST method
            the values in the input fields are stored in `req.body` object
            each <input> element is identified using its `name` attribute
            Example: the value entered in <input type="text" name="fName">
            can be retrieved using `req.body.fName`
        */		
		if (req.body.user_idNumber != ""){

			const idNumber = req.body.user_idNumber;

			const query = { idNumber: idNumber};
			const projection = { idNumber: 1 };
			const result = await db.findOne(User, query, projection);
			const result2 = await db.findOne(Admin, query, projection);
			
			if (result) {
				var idNum = req.body.user_idNumber;
			} else if (result2) {
				var idNum = req.body.user_idNumber;
			} else {
				var idNum = 0;
				console.log('User does not exist');
			}

		}
		else{
			var idNum = req.body.hiddenIdNumber;
		}
			
        var rsv = {
			startCampus: req.body.hiddenStartCampus,
			date: req.body.user_date,
			entryLoc: req.body.hiddenEntryLoc,
			entryTime: req.body.hiddenEntryTime,
			exitLoc: req.body.hiddenExitLoc,
			exitTime: req.body.hiddenExitTime,
		  };

		if ( rsv.entryLoc == "Entry Location" || rsv.entryTime == "Entry Time" || rsv.exitLoc == "Exit Location" || rsv.exitTime == "Exit Time" ){
			res.redirect('/Reservation?idNumber=' + req.body.adminId + '&reserveUserSuccess=false');
			console.log('Reservation failed to add');
		}
		else{

			var result;
			if (idNum !== 0) {
				rsv.idNumber = idNum;
				result = await db.insertOne(Reservation, rsv);
			}
			/*
				calls the function insertOne()
				defined in the `database` object in `../models/db.js`
				this function adds a document to collection `reservations`
			*/
			
			if ( result ){
				console.log('Reservation successfully added');
				res.redirect('/Reservation?idNumber=' + req.body.adminId + '&reserveUserSuccess=true');
			}
			else{
				res.redirect('/Reservation?idNumber=' + req.body.adminId + '&reserveUserSuccess=false');
				console.log('Reservation failed to add');
			}
		}

    },

	postUpdateReservations: async function (req, res){
		var curr ={
			startCampus: req.body.eCurrStartCampus,
			date: req.body.eCurrDate,
			entryLoc: req.body.eCurrEntryLoc,
			entryTime: req.body.eCurrEntryTime,
			exitLoc: req.body.eCurrExitLoc,
			exitTime: req.body.eCurrExitTime,
			idNumber: req.body.eCurrIdNumber
		}

		var upd = {
			startCampus: req.body.ehiddenStartCampus,
			date: req.body.user_date,
			entryLoc: req.body.ehiddenEntryLoc,
			entryTime: req.body.ehiddenEntryTime,
			exitLoc: req.body.ehiddenExitLoc,
			exitTime: req.body.ehiddenExitTime,
			idNumber: req.body.ehiddenIdNumber
		}
		
		if ( upd.entryLoc == "Entry Location" || upd.entryTime == "Entry Time" || upd.exitLoc == "Exit Location" || upd.exitTime == "Exit Time" ){
			res.redirect('/Reservation?idNumber=' + req.body.ehiddenIdNumber + '&isUpdateSuccess=false');
			console.log('Reservation failed to add');
		}
		else{
			
			console.log(upd.entryLoc);
			console.log(upd.entryTime);
			console.log(upd.exitLoc);
			console.log(upd.exitTime);

			var found = await db.findOne(Reservation, curr);
			if(found){
				await Reservation.updateOne(curr, upd);
				console.log('succesfully updated');
				res.redirect('/Reservation?idNumber=' + req.body.ehiddenIdNumber + '&isUpdateSuccess=true');
			}
			else{
				console.log("Code monkeys did an oopsie daisy");
				console.log('error somewhere');
			}
		}

		
	},

	postDelete: async function (req, res){
		var rsv = {
			startCampus: req.body.dCurrStartCampus,
			date: req.body.dCurrDate,
			entryLoc: req.body.dCurrEntryLoc,
			entryTime: req.body.dCurrEntryTime,
			exitLoc: req.body.dCurrExitLoc,
			exitTime: req.body.dCurrExitTime,
			idNumber: req.body.dCurrIdNumber
		};

		console.log('to delete');
		console.log(rsv);
		var deleted = await Reservation.deleteOne(rsv);
		if(deleted){
			console.log('succesfully deleted');
			res.redirect('/Reservation?idNumber=' + req.body.dCurrIdNumber + '&isDeleteSuccess=true');
		}
		else{
			console.log("Code monkeys did an oopsie daisy");
			console.log('error somewhere');
		}

	},

	getSearchUser: async function (req, res){

		res.redirect('/ReservationAdmin?idNumber=' + req.query.idNumber);

	},

	postSearchUser: async function (req, res){

		var idNumber = req.body.user_idNumber;
		var adminId = req.body.adminId;

		const isFoundUser = await db.findOne(User, {idNumber: idNumber}, {idNumber: 1});
		const isFoundAdmin = await db.findOne(Admin, {idNumber: idNumber}, {idNumber: 1});

		if ( isFoundUser == null && isFoundAdmin == null ){
			res.redirect('/ReservationAdmin?idNumber=' + adminId + '&isSearchUserValid=false');
		}
		else{

			console.log('test');

			const result = await db.findMany(Reservation, {idNumber: idNumber}, "");

			if ( result.length !== 0 ){
				res.render('ReservationAdmin', {result: result, adminId: adminId});
			} 
			else {
				res.redirect('/ReservationAdmin?idNumber=' + adminId + '&reservationList=false');
			}

		}
		
		

	},

	postSearchUserUpdate: async function (req, res){
		var curr ={
			startCampus: req.body.eCurrStartCampus,
			date: req.body.eCurrDate,
			entryLoc: req.body.eCurrEntryLoc,
			entryTime: req.body.eCurrEntryTime,
			exitLoc: req.body.eCurrExitLoc,
			exitTime: req.body.eCurrExitTime,
			idNumber: req.body.eCurrIdNumber
		}

		var upd = {
			startCampus: req.body.ehiddenStartCampus,
			date: req.body.user_date,
			entryLoc: req.body.ehiddenEntryLoc,
			entryTime: req.body.ehiddenEntryTime,
			exitLoc: req.body.ehiddenExitLoc,
			exitTime: req.body.ehiddenExitTime,
			idNumber: req.body.ehiddenIdNumber
		}

		console.log("current reservation:");
		console.log(curr);
		console.log("To be updated with: ");
		console.log(upd);

		if ( upd.entryLoc == "Entry Location" || upd.entryTime == "Entry Time" || upd.exitLoc == "Exit Location" || upd.exitTime == "Exit Time" ){

			var adminId = req.body.eAdminId;
			if (adminId == null){
				console.log("OH NO THE CODE MONKEYS DID AN OOPSIE WOOPSIE");
				adminId = 1111111;
			}
			const result = await db.findMany(Reservation, {idNumber: upd.idNumber}, {_id:0, __v:0});

			res.render('ReservationAdmin', {result, result, adminId: adminId, isUpdateSuccess: false});
			console.log('Reservation failed to add');

		}
		else{
			
			var found = await db.findOne(Reservation, curr);
			if(found){
				await Reservation.updateOne(curr, upd);
				console.log('Succesfully updated');
				
				var adminId = req.body.eAdminId;
				if (adminId == null){
					console.log("OH NO THE CODE MONKEYS DID AN OOPSIE WOOPSIE");
					adminId = 1111111;
				}
				const result = await db.findMany(Reservation, {idNumber: upd.idNumber}, {_id:0, __v:0});
				res.render('ReservationAdmin', {result: result, adminId: adminId, isUpdateSuccess: true});
			}
			else{
				console.log("Code monkeys did an oopsie daisy");
				console.log('error somewhere');
			}
		}
		

	},

	postSearchUserDelete: async function (req, res){
		var rsv = {
			startCampus: req.body.dCurrStartCampus,
			date: req.body.dCurrDate,
			entryLoc: req.body.dCurrEntryLoc,
			entryTime: req.body.dCurrEntryTime,
			exitLoc: req.body.dCurrExitLoc,
			exitTime: req.body.dCurrExitTime,
			idNumber: req.body.dCurrIdNumber
		};

		console.log('to delete');
		console.log(rsv);
		var deleted = await Reservation.deleteOne(rsv);
		if(deleted){
			console.log('succesfully deleted');
			
			var adminId = req.body.dAdminId;
			if (adminId == null){
				console.log("OH NO THE CODE MONKEYS DID AN OOPSIE WOOPSIE");
				adminId = 1111111;
			}
			const result = await db.findMany(Reservation, {idNumber: rsv.idNumber}, {_id:0, __v:0});
			res.render('ReservationAdmin', {result: result, adminId: adminId, isDeleteSuccess: true});
		}
		else{
			console.log("Code monkeys did an oopsie daisy");
			console.log('error somewhere');
		}

	}
    
}

module.exports = reservationController;
