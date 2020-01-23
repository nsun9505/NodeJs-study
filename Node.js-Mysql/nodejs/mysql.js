var mysql = require('mysql');
var connection = mysql.createConnection({
    host    : 'localhost',
    user    : 'nodejs',
    password: 'mysql',
    database: 'opentutorials'
});

connection.connect();
// 쿼리가 실행되면
// 콜백 함수의 시그니처에 값이 전달된다.
// error 가 있다면 err에 담기고
// 결과는 results에 담긴다.
connection.query('SELECT * FROM topic', function(error, results, fields){
    if(error){
        console.log(error);
    }
    console.log(results);
});