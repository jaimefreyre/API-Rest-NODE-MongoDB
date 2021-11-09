var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Endpoint routes configured
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var actorsRouter = require('./routes/actors');
var directorsRouter = require('./routes/directors');
var peliculasRouter = require('./routes/peliculas');
var episodiosRouter = require('./routes/episodios');
var seriesRouter = require('./routes/series');
var authRouter = require('./routes/auth');

const mongoose = require('mongoose');

require('dotenv').config();
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.CONNECTION_STRING, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true, 
  useFindAndModify: false, 
  useCreateIndex: true,
  useNewUrlParser: true
});
const connection = mongoose.connection;
connection.on('error', () => {
  throw new Error('Error connecting to the service');
});
connection.once('open', () =>{
  console.log('Conectado a la BD');
});

//Endpoint routes are assigned
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/actors', actorsRouter);
app.use('/api/directors', directorsRouter);
app.use('/api/peliculas', peliculasRouter);
app.use('/api/episodios', episodiosRouter);
app.use('/api/series', seriesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404, 'The endpoint you try to access does not exist'));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  //res.render('error');
  res.json({
    errorcode: err.status || 500,
    message: res.locals.message
  });
});

module.exports = app;
