# Cookie

## Cookie 생성
```javascript
var http = require('http');
http.createServer(function(request, response){
    

    // 생성하는 방법
    response.writeHead(200,{
        'Set-Cookie':['yummy_cookie=choco', 'tasty_cookie=strawberry']
    })
    response.end('cookie');
}).listen(3000);
```

## 쿠키 값 파싱
```javascript
var http = require('http');
var cookie = require('cookie');

http.createServer(function(request, response){
    console.log(request.headers.cookie);
    var cookies = {};

    if(request.headers.cookie !== undefined)
        cookies = cookie.parse(request.headers.cookie);
    console.log(cookies.yummy_cookie);
    
    // 생성하는 방법
    response.writeHead(200,{
        'Set-Cookie':['yummy_cookie=choco', 'tasty_cookie=strawberry']
    })
    response.end('cookie');
}).listen(3000);
```
- 위의 코드를 작성하기 전에 cookie 모듈을 다운로드 받아야 함.
```
 $ npm install --save cookie
```
- cookie.parse()를 사용하면 cookie 값을 객체로 변환시켜줌.

## 특정 path에서만 cookie를 생성하게 하기
```javascript
var http = require('http');
var cookie = require('cookie');

http.createServer(function(request, response){
    console.log(request.headers.cookie);
    var cookies = {};

    if(request.headers.cookie !== undefined)
        cookies = cookie.parse(request.headers.cookie);
    console.log(cookies.yummy_cookie);
    
    // 생성하는 방법
    response.writeHead(200,{
        'Set-Cookie':[
            'yummy_cookie=choco', 
            'tasty_cookie=strawberry',
            // Max-Age는 쿠키의 수명을 정한다.
            `Permanent=cookies; Max-Age=${60*60*24*30}`,
            'Secure=Secure; Secure',
            // Http에서만 사용된다.
            'HttpOnly=HttpOnly; HttpOnly',
            // Path의 값이 /cookie일 때만 해당 쿠키를 서버에 전달
            'Path=Path; Path=/cookie'
            // 해당 도메인을 사용하는 모든 서브도메인에서도 쿠키가 살아 있음.
            'Domain=Domain; Domain=o2.org'
        ]
    })

    response.end('cookie');
}).listen(3000);
```