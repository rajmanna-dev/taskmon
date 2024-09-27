import {
  googleStrategy,
  twitterStrategy,
  facebookStrategy,
} from './config/passportConfig.js';
import db from './config/dbConfig.js';
import session from 'express-session';
import bodyParser from 'body-parser';
import passport from 'passport';
import express from 'express';
import env from 'dotenv';

env.config();

// APP CONSTANTS
const app = express();
const port = process.env.PORT;

// SET UP SESSION
app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

// MIDDLEWARES
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(passport.initialize());
app.use(passport.session());

// AUTH ROUTES
app.get('/auth/google', passport.authenticate('google'));
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/facebook', passport.authenticate('facebook'));

// AUTHENTICATE DASHBOARD ROUTE
app.get(
  '/auth/google/dashboard',
  passport.authenticate('google', {
    successRedirect: '/dashboard',
    failureRedirect: '/',
  })
);

app.get(
  '/auth/twitter/dashboard',
  passport.authenticate('twitter', {
    successRedirect: '/dashboard',
    failureRedirect: '/',
  })
);

app.get(
  '/auth/facebook/dashboard',
  passport.authenticate('facebook', {
    successRedirect: '/dashboard',
    failureRedirect: '/',
  })
);

app.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect('/dashboard');
  } else {
    res.render('index.ejs');
  }
});

// PROTECT DASHBOARD ROUTE
app.get('/dashboard', (req, res) => {
  if (req.isAuthenticated()) {
    res.render('dashboard.ejs', { message: 'You are successfully logged in.' });
  } else {
    res.render('index.ejs', {
      message: 'Please login to continue with Taskmon',
    });
  }
});

// HANDLE LOGOUT
app.get('/logout', (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    res.redirect('/');
  });
});

// USE STRATEGIES
passport.use('google', googleStrategy);
passport.use('twitter', twitterStrategy);
passport.use('facebook', facebookStrategy);

passport.serializeUser((user, cb) => {
  return cb(null, user.id);
});

passport.deserializeUser(async (id, cb) => {
  try {
    const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    cb(null, result.rows[0]);
  } catch (err) {
    cb(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
