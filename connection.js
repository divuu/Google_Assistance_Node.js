var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "132.148.139.134",
  port: 3306,
  user: "jeeva",
  password: "jeeva!@#$",
  database: "jeeva_vedic"
});

module.exports = connection;
