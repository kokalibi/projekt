var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var borokRouter = require('./routes/borok');
var kep_upload = require('./routes/kep_feltolt');
var adatRouter = require('./routes/adat');



var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
const cors = require('cors');
var corsOptions={
    "credentials" : true,
    origin: "http://localhost:3000"
}
app.use(cors(corsOptions));
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/borok', borokRouter);
app.use('/api/upload', kep_upload);
app.use('/api/adat', adatRouter);


module.exports = app;
