import GoogleStrategy from 'passport-google-oauth2';
import TwitterStrategy from 'passport-twitter';
import db from './dbConfig.js';

// GOOGLE STRATEGY
const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/google/dashboard',
    userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo',
    scope: ['profile', 'email'],
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
);

// TWITTER STRATEGY
const twitterStrategy = new TwitterStrategy(
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
);

// EXPORT BOTH STRATEGIES
export { googleStrategy, twitterStrategy };
