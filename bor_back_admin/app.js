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

// --- CORS BEÁLLÍTÁS TÖBB FRONT-END PORHOZ ---
const cors = require('cors');

// Engedélyezett források (whitelist) meghatározása
const allowedOrigins = [
  'http://localhost:3000', // Első front-end port
  'http://localhost:3001', // Második front-end port
];

var corsOptions = {
    "credentials" : true,
    // Dinamikus origin függvény a több forrás engedélyezéséhez
    origin: function (origin, callback) {
        // Engedélyezzük, ha nincs origin (pl. Postman vagy azonos domainről érkező kérés),
        // VAGY ha az origin benne van az engedélyezett listában.
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true); // Engedélyezés
        } else {
            // A hiba könnyebb debuggolásához adtunk hozzá egy konzol üzenetet
            console.error(`CORS tiltás: ${origin} nem engedélyezett!`);
            callback(new Error('Nem engedélyezett a CORS!')); // Tiltás
        }
    }
}
app.use(cors(corsOptions));
// --- CORS BEÁLLÍTÁS VÉGE ---

app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/borok', borokRouter);
app.use('/api/upload', kep_upload);
app.use('/api/adat', adatRouter);


module.exports = app;