import GoogleStrategy from 'passport-google-oauth2';
import TwitterStrategy from 'passport-twitter';
import session from 'express-session';
import bodyParser from 'body-parser';
import passport from 'passport';
import express from 'express';
import env from 'dotenv';
import pg from 'pg';

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
  })
);

// MIDDLEWARES
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(passport.initialize());
app.use(passport.session());

// DATABASE CONNECTION
const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DB,
  password: process.env.PG_PASS,
  port: process.env.PG_PORT,
});
db.connect();

app.get('/', (req, res) => {
  res.render('index.ejs');
});

// PROTECT DASHBOARD ROUTE
app.get('/dashboard', (req, res) => {
  if (req.isAuthenticated()) {
    res.render('dashboard.ejs');
  } else {
    res.redirect('/');
  }
});

app.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

app.get(
  '/auth/google/dashboard',
  passport.authenticate('google', {
    successRedirect: '/dashboard',
    failureRedirect: '/',
  })
);

app.get(
  '/auth/twitter',
  passport.authenticate('twitter', {
    scope: ['profile', 'email'],
  })
);

app.get(
  '/auth/twitter/dashboard',
  passport.authenticate('twitter', {
    successRedirect: '/dashboard',
    failureRedirect: '/',
  })
);

// HANDLE LOGOUT
app.get('/logout', (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    res.redirect('/');
  });
});

// GOOGLE STRATEGY
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/google/dashboard',
      userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo',
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        const result = await db.query('SELECT * FROM users WHERE email = $1', [
          profile.email,
        ]);
        if (result.rowCount === 0) {
          const newUser = await db.query(
            'INSERT INTO users (picture, name, email, password, date) VALUES ($1, $2, $3, $4, $5)',
            [
              profile.picture,
              profile.displayName,
              profile.email,
              'google',
              new Date(),
            ]
          );
          return cb(null, newUser.rows[0]);
        } else {
          return cb(null, result.rows[0]);
        }
      } catch (err) {
        return cb(err);
      }
    }
  )
);

// TWITTER STRATEGY
passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
      callbackURL: 'http://localhost:3000/auth/twitter/dashboard',
    },
    async (token, tokenSecret, profile, cb) => {
      try {
        const result = await db.query('SELECT * FROM users WHERE email = $1', [
          profile.username,
        ]);
        if (result.rowCount === 0) {
          const newUser = await db.query(
            'INSERT INTO users (picture, name, email, password, date) VALUES ($1, $2, $3, $4, $5)',
            [
              profile.photos[0].value,
              profile.displayName,
              profile.username,
              'twitter',
              new Date(),
            ]
          );
          return cb(null, newUser.rows[0]);
        } else {
          return cb(null, result.rows[0]);
        }
      } catch (err) {
        return cb(err);
      }
    }
  )
);

passport.serializeUser((user, cb) => {
  return cb(null, user);
});

passport.deserializeUser((user, cb) => {
  return cb(null, user);
});

// RUN SERVER
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
