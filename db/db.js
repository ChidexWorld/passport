// db.js
const mysql = require("mysql2");

// Create a connection to the database
const connection = mysql.createPool({
  host: "localhost", // Your database host
  port: 3306, // Your database port
  user: "chidex", // Your database username
  password: "chidex1919@", // Your database password
  database: "classwork", // Your database name
});

// // Connect to the database
// connection.connect((err) => {
//   if (err) {
//     console.error("Database connection failed: " + err.stack);
//     return;
//   }
//   console.log("Connected to the database.");
// });

// Key Changes Explained
// Removed connection.connect():

// The connection pool manages its connections automatically, so there’s no need to manually connect.
// Using sessionStore:

// The session store is configured to use the pool directly. The express-mysql-session library will handle the connections from the pool.
module.exports = connection;
