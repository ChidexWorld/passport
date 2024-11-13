const express = require("express");
const db = require("./db/db"); // Import the database connection
const crypto = require("crypto");

const passport = require("passport");
const session = require("express-session");

// section store
const MySQLStore = require("express-mysql-session")(session);


// Import routes
const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard");

const app = express();

app.use(express.json()); // Parse JSON payloads
app.use(express.urlencoded({ extended: true })); // Middleware for parsing form data

// Configure session store
const sessionStore = new MySQLStore({}, db);

// Session setup
app.use(
  session({
    secret: crypto.randomBytes(30).toString("hex"), // Generates a 64-byte hex string,
    resave: false, // Only saves session if it’s modified, improving efficiency
    saveUninitialized: false, // Only creates session if data is added, reducing empty sessions for false else // Saves a session even if it hasn’t been modified for true
    cookie: {
      maxAge: 1000 * 60 * 5, // Sets the cookie expiration time in milliseconds (e.g., 1 minute here)
      secure: false, // Ensures cookies are sent over HTTPS only
      httpOnly: false, // Ensures cookies are only accessible by the web server, not client-side JavaScript
    },
    store: sessionStore, //The MySQL store created earlier.
  })
);

// Initialize Passport
app.use(passport.initialize()); //Passport wouldn’t be able to process authentication requests, which means user authentication would fail
app.use(passport.session()); //This middleware enables session management for authenticated users in your application.

// Use the router
app.use(authRoutes);
app.use(dashboardRoutes);

// Optionally use onReady() to get a promise that resolves when store is ready.
sessionStore
  .onReady()
  .then(() => {
    // MySQL session store ready for use.
    console.log("MySQLStore ready");
  })
  .catch((error) => {
    // Something went wrong.
    console.error(error);
  });

  

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
