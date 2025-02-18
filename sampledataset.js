const db = require('./models/db.js');
const Admin = require('./models/admindb.js');
const User = require('./models/userdb.js');
const Reservation = require('./models/reservationdb.js');
const bcrypt = require('bcrypt');
const saltRounds = 10;

db.connect();

var password;
var securityCode;

async function generateInfo(password, securityCode){
  password = await bcrypt.hash(password, saltRounds);
  securityCode =  await bcrypt.hash(securityCode, saltRounds);
  return { password, securityCode };
}

async function addAdminUser(){

  var { password, securityCode } = await generateInfo('admin', '1234');
  /* ADMIN USERS */
  generateInfo('admin', '1234');
  var user = {
    firstName: 'Admin',
    lastName: 'Admin',
    email: 'admin@gmail.com',
    idNumber: '99999999',
    password: password,
    securityCode: securityCode,
    designation: 'Faculty',
    passengerType: 'Employee',
    profilePicture: 'images/profilepictures/Default.png'
  };
  var result = db.insertOne(Admin, user);
  console.log('Admin User successfully added');

  var { password, securityCode } = await generateInfo('maui', '1234');
  var user = {
    firstName: 'Maui',
    lastName: 'Lopez',
    email: 'maui@gmail.com',
    idNumber: '12177539',
    password: password,
    securityCode: securityCode,
    designation: 'Faculty',
    passengerType: 'Employee',
    profilePicture: 'images/profilepictures/Default.png' 
  };
  var result = db.insertOne(Admin, user);
  console.log('Admin User successfully added');

  var { password, securityCode } = await generateInfo('benmar', '1234');
  var user = {
    firstName: 'Benmar',
    lastName: 'Ramirez',
    email: 'benmar@gmail.com',
    idNumber: '12116866',
    password: password,
    securityCode: securityCode,
    designation: 'Faculty',
    passengerType: 'Employee',
    profilePicture: 'images/profilepictures/Default.png'
};
var result = db.insertOne(Admin, user);
console.log('Admin User successfully added');

var { password, securityCode } = await generateInfo('nathan', '1234');
var user = {
  firstName: 'Nathan',
  lastName: 'Asnan',
  email: 'asnan@gmail.com',
  idNumber: '12043338',
  password: password,
  securityCode: securityCode,
  designation: 'Faculty',
  passengerType: 'Employee',
  profilePicture: 'images/profilepictures/Default.png'
};
var result = db.insertOne(Admin, user);
console.log('Admin User successfully added');

var { password, securityCode } = await generateInfo('itadmin', '1234');
var user = {
    firstName: 'IT',
    lastName: 'IT',
    email: 'it@gmail.com',
    idNumber: '11111111',
    password: password,
    securityCode: securityCode,
    designation: 'Faculty',
    passengerType: 'Employee',
    profilePicture: 'images/profilepictures/Default.png'
};
var result = db.insertOne(Admin, user);
console.log('User successfully added');

}

async function addNormalUser(){

var { password, securityCode } = await generateInfo('123', '1234');
var user = {
  firstName: 'Maui',
  lastName: 'Lopez',
  email: 'mauilopez@gmail.com',
  idNumber: '12345678',
  password: password,
  securityCode: securityCode,
  designation: 'Student',
  passengerType: 'Student',
  profilePicture: 'images/profilepictures/Default.png'
};
var result = db.insertOne(User, user);
console.log('User successfully added');
  

var { password, securityCode } = await generateInfo('123', '1234');
var user = {
  firstName: 'Haeleynah',
  lastName: 'Ramos',
  email: 'haeleynahramos@gmail.com',
  idNumber: '12345671',
  password: password,
  securityCode: securityCode,
  designation: 'Student',
  passengerType: 'Student',
  profilePicture: 'images/profilepictures/Default.png'    
};
var result = db.insertOne(User, user);
console.log('User successfully added');
  

var { password, securityCode } = await generateInfo('123', '1234');
var user = {
  firstName: 'Charles',
  lastName: 'De Guzman',
  email: 'charlesdeguzman@gmail.com',
  idNumber: '12345672',
  password: password,
  securityCode: securityCode,
  designation: 'Student',
  passengerType: 'Student',
  profilePicture: 'images/profilepictures/Default.png'
};
var result = db.insertOne(User, user);
console.log('User successfully added');
  

var { password, securityCode } = await generateInfo('123', '1234');
var user = {
  firstName: 'Noah',
  lastName: 'Arreola',
  email: 'noaharreola@gmail.com',
  idNumber: '12345673',
  password: password,
  securityCode: securityCode,
  designation: 'Student',
  passengerType: 'Student',
  profilePicture: 'images/profilepictures/Default.png'
};
var result = db.insertOne(User, user);
console.log('User successfully added');
  

var { password, securityCode } = await generateInfo('123', '1234');
var user = {
  firstName: 'Alex',
  lastName: 'Natividad',
  email: 'alexnatividad@gmail.com',
  idNumber: '12345674',
  password: password,
  securityCode: securityCode,
  designation: 'Student',
  passengerType: 'Student',
  profilePicture: 'images/profilepictures/Default.png'
};
var result = db.insertOne(User, user);
console.log('User successfully added');

}

addAdminUser();
addNormalUser();

var rsv = {
  startCampus: 'Laguna',
  date: '2023-07-24',
  entryLoc: 'Carmona -> DLSU LC',
  entryTime: '06:00 AM',
  exitLoc: 'DLSU LC -> DLSU Manila',
  exitTime: '03:00 PM',
  idNumber: '12345678'
};
var result = db.insertOne(Reservation, rsv);
console.log('User reservation successfully added');

var rsv = {
  startCampus: 'Laguna',
  date: '2023-07-25',
  entryLoc: 'Paseo -> DLSU LC',
  entryTime: '08:00 AM',
  exitLoc: 'DLSU LC -> Carmona',
  exitTime: '04:45 PM',
  idNumber: '12345671'
};
var result = db.insertOne(Reservation, rsv);
console.log('User reservation successfully added');

var rsv = {
  startCampus: 'Laguna',
  date: '2023-07-26',
  entryLoc: 'Walter Mart -> DLSU LC',
  entryTime: '06:30 AM',
  exitLoc: 'DLSU LC -> Walter Mart',
  exitTime: '04:45 PM',
  idNumber: '12345672'
};
var result = db.insertOne(Reservation, rsv);
console.log('User reservation successfully added');

var rsv = {
  startCampus: 'Laguna',
  date: '2023-07-26',
  entryLoc: 'Walter Mart -> DLSU LC',
  entryTime: '06:30 AM',
  exitLoc: 'DLSU LC -> Walter Mart',
  exitTime: '04:45 PM',
  idNumber: '12345673'
};
var result = db.insertOne(Reservation, rsv);
console.log('User reservation successfully added');

var rsv = {
  startCampus: 'Laguna',
  date: '2023-07-26',
  entryLoc: 'Walter Mart -> DLSU LC',
  entryTime: '06:30 AM',
  exitLoc: 'DLSU LC -> Walter Mart',
  exitTime: '04:45 PM',
  idNumber: '12345674'
};
var result = db.insertOne(Reservation, rsv);
console.log('User reservation successfully added');
