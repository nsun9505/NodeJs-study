# Chpater 04. http 모듈로 웹 서버 만들기

## 요청과 응답 이해하기
- 클라이언트에서 서버로 request를 보내고, 서버에서는 request의 내용을 읽고 처리한 뒤, 클라이언트에게 response를 보낸다.
  - request와 response는 이벤트 방식이라고 생각하기
  - 클라이언트로부터 요청이 왔을 때 어떤 작업을 수행할지 이벤트 리스너를 미리 등록

```javascript
    const http = require('http');

    http.createServer((req, res) => {
        // response 처리
    })
```
  - req 객체는 요청에 관한 정보, res는 응답에 관한 정보들을 담고 있음.

```javascript
const http = require('http');

http.createServer((req, res) => {
        res.write('<h1>Hello Node.js!!</h1>');
        res.end('<p>Hello Node.js Server</p>');
}).listen(8080, () => {
        console.log('8080 port에서 서버 대기');
});
```
  - res.end()는 응답을 종료하는 메서드, 인자가 있다면 해당 데이터도 클라이언트로 보내고 응답을 종료

- HTML 코드를 적는 것은 비효율적이므로, HTML 파일을 읽어서 전송하는 방법
  - index.html 내용
    ```HTML
        <html>
            <head>
                <meta charset="urf-8"/>
                <title>Node.js Web Server</title>
            </head>
            <body>
                <h1> Node.js Web Serve </h1>
                <h2> Hello World </h2>
            </body>
        </html>
    ```
    - server2.js 내용
    ```javascript
        const http = require('http');
        const fs = require('fs');

        http.createServer((req, res) => {
            fs.readFile('./index.html', (err, data) => {
                if(err) throw err;
                res.end(data);
            })
        }).listen(8080, () => {
            console.log("server listening port 8080");
        });
    ```

## 쿠키와 세션 이해하기
- server4.html
```html
    <html>
        <head>
            <meta charset="utf-8"/>
            <title>쿠키&세션 이해하기</title>
        </head>
        <body>
            <form action="/login">
                <input type="text" name="name" id="name" placeholder="이름을 입력하세요.">
                <input type="submit" value="login">
            </form>
        </body>
    </html>
```

- server4.js
```javascript
    const http = require('http');
    const fs = require('fs');
    const url = require('url');
    const qs = require('querystring');

    const parseCookie = (cookie = '') => 
        cookie
        .split(';')
        .map(v => v.split('='))
        .map(([k, ...vs]) => [k, vs.join('=')])
        .reduce((acc, [k, v]) => {
            acc[k.trim()] = decodeURIComponent(v);
            return acc;
        }, {});

        http.createServer((req, res) => {
            const cookies = parseCookie(req.headers.cookie);
            if(req.url.startsWith('/login')){
                const { query } = url.parse(req.url);
                const { name } = qs.parse(query);
                const expires = new Date();
				console.log(encodeURIComponent(name));
                res.writeHead(302, {
                    Location: '/',
                    'Set-Cookie': `name=${encodeURIComponent(name)}; HttpOnly; Path=/`
                })
				res.end();
            } else if(cookies.name){
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                res.end(`${cookies.name}님 안녕하세요.`);
            } else {
                fs.readFile('./server4.html', (err, data) => {
                    if(err) throw err;
                    res.end(data);
                })
            }
        }).listen(8083, () => {
            console.log('test');
        })
```

## REST API와 라우팅
### REST API는 REpresentational State Transfer의 약자.
- 네트워크 구조의 한 형식, 서버의 자원을 정의하고, 자원에 대한 주소를 지정하는 방법
  - 주소는 의미를 명확하게 전달하기 위한 명서로 구성
- HTTP 요청 메서드
  - GET : 서버 자원을 가져오고자 할 때 사용. 요청의 본문에 데이터를 넣지 않음. 서버로 데이터를 보낸다면 쿼리스트링 사용
  - POST : 서버에 자원을 새로 등록하고자 할 때 사용. 요청의 본문에 새로 등록할 데이터를 넣어 보낸다.
  - PUT : 서버의 자원을 요청에 들어 있는 자원으로 치환하고자(변경하고자)할 때 사용. 요청의 본문에 변경할 데이터를 넣어 보냄.
  - PATCH : 서버 자원의 일부만 수정하고자 할 때 사용. 요청의 본문에 일부 수정할 데이터를 넣어 보낸다.
  - DELETE : 서버의 자원을 삭제하고자 할 때 사용
- 주소 하나가 요청 메서드를 여러 개 가질 수 있음.
  - Ex. GET 메서드의 /myuser 주소로 요청을 보내면 사용자 정보를 가져오라는 요청
  - EX. POST method의 /myuser 주소로 요청을 보내면 사용자 정보를 등록하려 한다는 것을 알 수 있음.

- REST API를 따르는 서버를 RESTful하다고 표현
  - 코드를 작성하기 전에 대략적인 주소를 먼저 설계하는 것이 좋음.


## https와 http2

## cluster
### cluster 모듈은 싱글 스레드인 노드가 CPU 코어를 모두 사용할 수 있게 해주는 모듈
- 포트를 공유하는 노드 프로세스를 여러 개 둘 수도 있어 요청이 많이 들어왔을 때 병렬로 실행된 서버의 개수만큼 요청이 분산되게 할 수 있다.
- cluster 모듈을 설정하여 코어 하나당 프로세스 하나가 돌아가게 할 수 있음.
  - 세션을 공유하지 못함.(Redis 등의 서버를 도입하여 해결 가능)
  
