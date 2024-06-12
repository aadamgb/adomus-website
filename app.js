const express = require("express");
const exphbs = require("express-handlebars");
const path = require('path');
const cookieParser = require('cookie-parser');
const mysql = require("mysql2");
const dotenv = require('dotenv');
const { type } = require("os");
const { title } = require("process");
const { error } = require("console");

const session = require('express-session');
const flash = require('connect-flash');
// Shopping cart test


dotenv.config({path: './.env'})

const app = express();


const publicDirectory = path.join(__dirname,'./public');
app.use(express.static(publicDirectory));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// app.engine('hbs', exphbs.engine({defaultLayout: null,  extname: '.hbs' }));

app.set('view engine','hbs');

// Session or flash messages

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
  }));
  
  app.use(flash());
  app.use((req, res, next) => {
    res.locals.messages = req.flash();
    next();
  });
// Data base connection

const adomus_db = mysql.createConnection({
    host: process.env.database_host,
    user: process.env.database_user,
    password: process.env.database_password,
    database: process.env.database,
    port: '3306'
});

adomus_db.connect( (error) => {
    if(error){
        console.log(error)
    }else{
        console.log("MYSQL Connected!")
    }
})


//Define Routes
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));

app.listen(5000, () => {
    console.log("Server started on Port 5000");
})