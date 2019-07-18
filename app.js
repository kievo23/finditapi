const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const config = require(__dirname , '/config.json');
const JWTSecretKey = config.token_secret;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/login', async (req, res) => {
  // get user object from the data source, Ex: database 
  let user = await User.findOne({ $or:[ {'username':req.body.username }, { 'email':req.body.username } ] });
  if (!user) {
    //return done(null, false, { message: 'Incorrect username.' });
    res.json({
        code: 401,
        msg: "Incorrect Username or Email"
    });
  }else if (!bcrypt.compareSync(password, user.password)) {
    //return done(null, false, { message: 'Incorrect password.' });
    res.json({
      code: 401,
      msg: "Incorrect Password"
  });
  }else{
    // sign with default (HMAC SHA256) 
    const token = jsonWebToken.sign(user, JWTSecretKey);
    res.json({
        code: 200,
        token: token
    });
  }
    //return done(null, user);
});

// GET - http://localhost:3000/verify/{token}
app.get('/verify/:token', (req, res) => {
  try {
      const tokenDecodedData = jsonWebToken.verify(req.params.token, JWTSecretKey);
      return res.json({
          error: false,
          data: tokenDecodedData
      });
  } catch (error) {
      res.json({
          error: true,
          data: error
      });
  }
})

//JWT MIDDLEWARE
//https://medium.com/@patrykcieszkowski/jwt-authentication-in-express-js-ee898b87a60
//https://arjunphp.com/use-jwt-json-web-token-express-js/


app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
