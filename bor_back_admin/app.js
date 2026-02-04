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
var adminAuthRoutes = require("./routes/admin_auth_routes");
var MessageRoutes = require("./routes/message_routes");
var userRoutes = require("./routes/user_routes");
var paymentRoutes = require('./routes/payment_routes');

var app = express();

// --------------------------
// ⭐ CORS – engedélyezve Vite-nek
// --------------------------

// --------------------------
// Alap middleware-ek
// --------------------------
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(cors({
  origin: function (origin, callback) {
    // Engedélyezzük, ha nincs origin (pl. mobil app) 
    // VAGY ha localhost-ról VAGY a hálózati IP-dről jön a kérés
    if (!origin || origin.startsWith('http://localhost') || origin.includes('10.210.71')) {
      callback(null, true);
    } else {
      callback(new Error('CORS hiba: Ez a forrás nem engedélyezett.'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// --------------------------
// Statikus fájlok (képek!)
// --------------------------
app.use('/feltoltesek', express.static(path.join(__dirname, 'feltoltesek')));
app.use('/public/uploads', express.static(path.join(__dirname, 'public', 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

// --------------------------
// Route-ok bekötése
// --------------------------

app.use('/api/borok', borokRouter);
app.use('/api/adat', adatRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/payment-methods', paymentRoutes); // Új végpont bekötése
app.use('/api/orders', ordersRouter);
app.use('/api/order-items', orderItemsRouter);
app.use("/api/user", userRoutes);



// ⬇⬇⬇ Auth route-ok
app.use("/api/auth", authRouter);

app.use("/api/admin", adminAuthRoutes);

//message route-ok
app.use("/api/messages", MessageRoutes);

module.exports = app;
