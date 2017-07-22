/**
 * Module dependencies.
 */
const path = require('path');
const express = require('express');
const session = require('express-session');
const lusca = require('lusca');
const dotenv = require('dotenv');
const errorHandler = require('errorhandler');
const expedia = require('./expedia.js');

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({ path: '.env.prod' });

/**
 * Create Express server and configuration.
 */
const app = express();
const PORT = process.env.PORT || 8080;
app.use(express.static(path.join(__dirname, 'dist')));
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
}));

/**
 * lusca CSRF middleware, for xframe and xssProtection protection
 */
app.use((req, res, next) => {
  if (req.path === '/api/upload') {
    next();
  } else {
    lusca.csrf()(req, res, next);
  }
});
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));

/**
 * App routes.
 */
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/../dist/index.html');
});

/**
 * API routes.
 */
app.get('/api/getOffers',function(req,res) {
    // console.log(handleAPIRequest);
    console.log(expedia);
    expedia.handleAPIRequest(req,res);
});

/**
 * Error Handler.
 */
app.use(errorHandler());

/**
 * Start Express server.
 */
app.listen(PORT, error => {
    error
        ? console.error(error) : console.info(`==> 🌎 Listening on port ${PORT}. Visit http://localhost:${PORT}/ in your browser.`)
});

module.exports = app;