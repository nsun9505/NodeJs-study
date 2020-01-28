var mysql = require('mysql');
var db = mysql.createConnection({
    host      : 'localhost',
    user      : 'nodejs',
    password  : 'mysql',
    database  : 'opentutorials'
  });
  db.connect();
  module.exports = db;