var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'remotemysql.com',
    port: 3306,
    user: 'oNxao9MfUy',
    password: 'oEcrYtFtAc',
    database: 'oNxao9MfUy'
});

module.exports = connection;