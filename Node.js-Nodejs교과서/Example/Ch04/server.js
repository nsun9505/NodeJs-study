const http = require('http');

http.createServer((req, res) => {
	res.write('<h1>Hello Node.js!!</h1>');
	res.end('<p>Hello Node.js Server</p>');
}).listen(8080, () => {
	console.log('8080 port에서 서버 대기');
});
