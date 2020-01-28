// 실제 git에 올릴 때는 db.template.js를 올리고
// 프로젝트를 구성할 때는 db.template.js를 기반으로 
// db.js를 만들어서 사용할 수 있다.
var mysql = require('mysql');
var db = mysql.createConnection({
    host      : '',
    user      : '',
    password  : '',
    database  : ''
  });
  db.connect();
  module.exports = db;