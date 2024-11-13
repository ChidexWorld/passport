const express = require("express");
const router = express.Router();

// Middleware to check if a user is authenticated
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    // Check if the user is logged in
    return next(); // Proceed to the next middleware or route handler
  }
  if (req.user) return next();
  res.redirect("/login"); // Redirect to login if not authenticated
}

router.get("/dashboard", isAuthenticated, (req, res) => {
  console.log("i am in my dashboard");
  console.log({
    getUserInfo: req.user,
    session: req.session,
    sessionID: req.sessionID,
  });
  res.send(`Welcome to your dashboard, ${req.user.username}!, ${req.user.id}`);
});

module.exports = router;
