// ================================
//  TELJES, MŰKÖDŐ app.js
// ================================

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

var borokRouter = require('./routes/borok');
var adatRouter = require('./routes/adat');
var uploadRouter = require('./routes/kep_feltolt');
var ordersRouter = require('./routes/order_routes');
var orderItemsRouter = require('./routes/rendeles_tetelek_routes');
var authRouter = require("./routes/auth");
var cookieParser = require("cookie-parser");

var app = express();

// --------------------------
// ⭐ CORS – engedélyezve Vite-nek
// --------------------------
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:5174"
    ],
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    credentials: true,
  })
);

// --------------------------
// Alap middleware-ek
// --------------------------
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// --------------------------
// Statikus fájlok (képek!)
// --------------------------
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

// --------------------------
// Route-ok bekötése
// --------------------------

app.use('/api/borok', borokRouter);
app.use('/api/adat', adatRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/order-items', orderItemsRouter);

// ⬇⬇⬇ Auth route-ok
app.use("/api/auth", authRouter);
module.exports = app;
