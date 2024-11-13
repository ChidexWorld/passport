const express = require("express");
const db = require("../db/db"); // Import the database connection
const bcrypt = require("bcrypt");
const saltRounds = 10;
const router = express.Router();
const passport = require("passport");
var LocalStrategy = require("passport-local");

//register the user and hash them with passport
router.post("/register", (req, res) => {
  const { username, email, password } = req.body;

  //check the input are all field
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  console.log(username);

  //hash password
  bcrypt.hash(password, saltRounds, function (err, hash) {
    // Store hash in your password DB.
    if (err) {
      console.error("Error while hashing the password:", err);

      return res
        .status(500)
        .json({ message: "error while hashing the password" });
    }
    console.log(hash);

    const query =
      "INSERT INTO users (username,email, password) VALUES (?, ?, ?)";

    db.query(query, [username, email, hash], (err, result) => {
      //error handling
      if (err) {
        console.error("Error inserting user:", err); // Log the error
        return res.status(500).json({ message: "Internal server error" }); // Send error response
      }
      console.log("User registered with ID:", result.insertId);
    });
  });

  res.sendStatus(200);
});

passport.use(
  //compare the username with the username provided
  new LocalStrategy(function verify(username, password, cb) {
    db.query(
      //this should be query
      "SELECT * FROM users WHERE username = ?",
      [username],
      function (err, user) {
        if (err) {
          console.error("Database error:", err);
          return cb(err);
        }
        if (!user) {
          return cb(null, false, {
            message: "Incorrect username or password.",
          });
        }
        console.log(username);
        console.log(user[0]); // this user is always an array make sure to use index

        // Load hash from your password DB.
        //password is the received password from the input
        //user.password is the password from the database
        bcrypt.compare(password, user[0].password, function (err, result) {
          if (err) return cb(err);
          if (!result) {
            console.log("incorrect password");
            return cb(null, false, {
              message: "Incorrect username or password.",
            });
          }
          console.log("authenticated successfully");
          return cb(null, user[0]); // user is authenticated successfully
          //after this you are to use express-session middleware
        });
      }
    );
  })

  //compare the input password and the current password
);

// Serialize user for the session
passport.serializeUser((user, done) => {
  console.log("Serializing user:", { id: user.id });
  done(null, user.id); // Store only the user ID in the session
});

//deserializeUser user
passport.deserializeUser(function (id, cb) {
  console.log("we are in deserializeUser");

  db.query("SELECT * FROM users WHERE id = ?", [id], function (err, user) {
    if (err) {
      return cb(err);
    }
    console.log(user[0]);
    return cb(null, user[0]);
  });
});

// Login route

router.post(
  "/login/auth",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
  })
);

//logout routes

router.get("/logout", (req, res) => {
  if (!req.user) return res.sendStatus(400);
  req.logout((err) => {
    if (err) return res.sendStatus(400);
    return res.sendStatus(200);
  });
});

module.exports = router;
