const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mysql = require('mysql2/promise');
const cors = require('cors');
const {sequelize,connectToDB} = require('./config/db-config')
const createError = require('http-errors');
const dotenv = require('dotenv');
const registerRouter = require('./controllers/register');
const loginRouter = require('./controllers/login');
const userDashboardRouter = require('./controllers/UserDashboard');
const forgot_passwordRouter = require('./controllers/forgot_password');
const resetPasswordRouter = require('./controllers/Reset_Password');
const logoutRouter = require('./controllers/Logout');
const reviewRouter = require('./controllers/Review');
const authenticationRouter = require('./controllers/auth');
const authRouter = require('./controllers/authRouter');
const { User, Review } = require('./Model/models.js'); 

const app = express();
dotenv.config({ path: path.join(__dirname, 'config/.env') });


// Middleware setup
app.use(logger('dev')); // Logging
app.use(express.json({ limit: '5000kb' })); // JSON parsing with body size limit
app.use(express.urlencoded({ extended: false })); // URL-encoded body parsing
app.use(cookieParser()); // Cookie parsing
app.use(express.static(path.join(__dirname, 'public'))); // Static file serving

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:3000', // Replace with your client URL
  credentials: true, // Allow cookies
};
app.use(cors(corsOptions));
// View engine setup (if using)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade'); // Adjust for your view engine

// Routers
//app.use('/', indexRouter);
//app.use('/controllers/users', usersRouter);
app.use('/controllers/register', registerRouter);
app.use('/controllers/login', loginRouter);
app.use('/controllers/dashboard', userDashboardRouter);
app.use('/controllers/auth', authenticationRouter);
app.use('/controllers/authRouter', authRouter);
app.use('/controllers/forgot_password', forgot_passwordRouter);
app.use('/controllers/Reset_Password', resetPasswordRouter);
app.use('/controllers/Logout', logoutRouter);
app.use('/controllers/Review', reviewRouter);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error'); // Adjust for your error handling view
});


// Start the server
const port =  3001;
app.listen(port, async () => {
  console.log(`Server listening on port ${port}`);
  await connectToDB();
   // Sync models with the database
   await sequelize.sync({ force: false }); // Set force to true if you want to drop and re-create tables on every server restart
   console.log('Database synchronized');
});

// Export the app instance
module.exports = { app };
