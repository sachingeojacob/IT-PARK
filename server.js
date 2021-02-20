//importing required modules
var express = require("express");
var app = express()
var mongoose = require("mongoose");
require('dotenv').config();
var ejs = require('ejs');
var path = require('path')
var parser = require('body-parser')
//var session = require('expresss-session')

//Accesing routers

const index = require('./router/index');
const register = require('./router/register');
/*const login = require('./router/login');
const adminDashboard = require('./router/admin');*/


//setting directeries like ejs public
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'))

//config session

/*app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
}));
*/


// This statement is used to connect databse
mongoose.connect(process.env.DATABASE, {useUnifiedTopology: true, useNewUrlParser: true}, () => console.log("Database connected"));


// Setting basic configurations
app.use(parser.urlencoded({ extended: false })) // configuring parser
app.use(express.json());


// setting router endpoints

app.use('/', index);
app.use('/', register)
/*app.use('/', login);
app.use('/admin', adminDashboard);*/




// Setting port number as 5000 and starting connection
app.listen(3000, () => console.log("Server is starting"));