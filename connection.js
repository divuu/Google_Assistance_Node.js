var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "132.148.139.134",
  port: 3306,
  user: "*******",
  password: "***************",
  database: "routealert_4p6"
});

module.exports = connection;
