# Chapter 06. 익스프레스 웹 서버 만들기

## express-generator를 이용한 프로젝트 생성
```sh
 $ npm i -s express-generator
 $ express [project_name] --view=pug
```
 - --view=pug란
   - Jade는 기본 템플릿 엔진인데, Jade에서 Pug로 이름을 개명함..

### 디렉터리 구조
#### bin : www 파일은 서버를 실행하는 스크립트
#### public : 외부에서 접근 가능한 파일들을 모아둔 곳.(이미지, 자바스크립트, CSS 등)
#### routes : 주소별 라우터들을 모아 놓음.
#### views : 템플릿 파일들을 모아 놓은 곳.

## 익스프레스 구조 이해
### bin/www
```sh
#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('../app');
var debug = require('debug')('learn-express:server');
var http = require('http');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
```
- http 모듈에 express 모듈을 연결하고, 포트를 지정하는 부분


## Middleware
- 요청과 응답의 중간(middle)에 위치하여 미들웨어라고 부른다.
  - 요청과 응답을 조작하여 기능을 추가하기도 하고, 나쁜 요청을 걸러내기도 한다.
- 미들웨어는 주로 app.use()와 함께 사용된다.
  - app.use() 역할
    - 인자로 들어 있는 함수가 미들웨어이다.
    - 미들웨어는 use 메서드로 app에 장창한다.
    
### 커스텀 미들웨어
```javascript
//app.js
...
 app.use(function(req, res, next){
   console.log("안녕하세요 미들웨어입니다.");
   next();
 });
 ...
```
- 반드시 미들웨어 안에서 next()를 호출해야 다음 미들웨어로 넘어간다.
- next()는 미드웨어의 흐름을 제어하는 핵심적인 역할
  - 인자를 넣지 않으면 단순하게 다음 미들웨어로 넘어간다.
  - 인자로 route를 넣으면 특수한 기능을 하게 된다.
  - route 외의 다른 값을 넣으면 다른 미들웨어나 라우터를 건너 뛰고 에러 헨들러로 이동

### morgan
- 요청에 대한 정보를 콘솔에 출력
```javascript
  var logger = require('morgan');
  ...
  app.use(logger('dev'));
```
- 함수의 인자로 dev, short, common, combined 등을 전달할 수 있다.
  - 인자에 따라 콘솔에 나오는 로그가 다름.
  - 개발 시에는 short 또는 dev, 배포 시에는 common이나 combined를 많이 사용
  - 데이터베이스에 로그를 남길 수도 있다.(winston 모듈 필요)

### body-parser
- 요청의 본문을 해석해주는 미들웨어
  - 보통 폼 데이터나 AJAX 요처의 데이터를 처리
  ```javascript
    var bodyParser = require('body-parser');
    ...
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
  ```
  - express 4.16.0 버전부터 body-parser를 일부 기능으로 포함함.
  - raw, text 형식의 본문을 추가로 해석 가능
    - Raw는 본문이 버퍼일 때, Text는 텍스트 데이터일 때 해석하는 미들웨어.
    - 적용
    ```javascript
      app.use(bodyParser.raw());
      app.use(bodyParser.text());
    ```
  - urlencoded 메서드를 보면 { extended: false }라는 옵션
    - false이면 노드의 querystring 모듈을 사용하여 쿼리 스트링을 해석
    - true이면 qs 모듈을 사용하여 쿼리스트링을 해석
      - qs는 내장 모듈이 아니므로 npm을 통해 설치해야 함.(querystring의 기능을 확장한 모듈)
  - 본문을 요청받으러면 req.on('data')와 req.on('end')로 스트림을 사용했지만
    - body-parser를 사용하면 패키지 내부적으로 본문을 해석행서 req.body에 추가해준다.
  
### cookie-parser
- request에 포함된 쿠키를 해석해준다.
```javascript
  var cookieParser = require('cookie-parser');
  ...
  app.use(cookieParser());
```

### static
- 정적인 파일들을 제공한다.
  - express 4.16.0 버전에서는 body-parser의 일부분이 내장되어 유일한 내장 미들웨어는 아님
  - express를 설치하면 따라오므로 따로 설치할 필요 없음.
  ```javascript
    app.use(express.static(path.join(__dirname, 'public')));
  ```
  - 함수의 인자로 정적 파일들이 담겨 있는 폴더를 지정하면 된다.
  - 실제 서버의 폴더 경로에는 public이 들어 있지만, 요청 주소에는 public이 들어 있지 않음.
  - 서버의 폴더 경로와 요청 경로가 다르므로 외부인이 서버의 구조를 쉽게 파악할 수 없음.
  - fs.readFile로 파일을 직접 읽어서 전송할 필요 없음.
  ```javascript
    app.use('/img', express.static(path.join(__dirname, 'public')));
  ```
  - 정적파일을 제공할 주소를 지정 가능

- 자체적으로 정적 파일 라우터 기능을 수행하므로 최대한 위쪽에 배치하는 것이 좋음.
  - 보통 morgan 다음에 배치
  - static 미들웨어를 morgan 보다도 위에 배치하면 정적 파일 요청이 기록되지 않음.

### express-session
- 세션 관리용 미들웨어
  - 로그인 등의 이유로 세션을 구현할 때 매우 유용
  - npm으로 설치해야 함.
  ```javascript
  var session = require('express-session');
  ...
  app.use(session({
   resave: false,
   saveUninitialized: false,
   secret: 'secret code',
   cookie:{
     httpOnly: true,
     secure: false
   }
  }));
  ```
  - 세션에 대한 설정을 인자로 받음.
    - resave : 요청이 왔을 때 세션에 수정 사항이 생기지 않더라도 세션을 다시 저장할지
    - saveUninitialized : 세션에 저장할 내역이 없더라도 세션을 저장할지에 대한 설정
    - secret : 필수 항목으로 cookie-parser의 비밀키와 같은 역할을 한다.

- express-session은 세션 관리 시 클라이언트에 세션 쿠키를 보낸다.
  - 안전하게 보내려면 쿠키에 서명을 추가해야 하고, 쿠키를 서명하는 데 secret 값이 필요
  - cookie-parser에 secret 값과 같게 설정해야 함.
  - secure 옵션은 false로 해서 https 환경이 아니라도 사용할 수 있게 함. 배포 시에는 true 권장

### connect-flash
- 일회성 메시지들을 웹 브라우저에 나타낼 때 좋음.
  - 별도로 설치가 필요
  ```
    $ npm i -s connect-flash
  ```
- cookie-parser와 express-session을 사용하므로 이들보다는 뒤에 위치해야 함.

- flash 미들웨어는 req 객체의 req.flash 메서드를 추가한다.
  - req.flash(key, value)로 해당 키에 값을 설정하고, req.flash(key)로 해당 키에 대한 값을 받음.

- 일회성 메시지라는 성질을 이용하여 로그인 에러나 회원가입 에러 같은 일회성 경고 메세지는 flash 미들웨어로 보내면 좋음.

## Router 객체로 라우팅 분리하기
- use 메서드는 모든 HTTP 메서드에 대해 요청 주소만 일치하면 실행되지만 get, post, put, patch, delete 같은 메서드는 주소뿐만 아니라 HTTP 메서드까지 일치하는 요청일 때만 실행

- routes/index.js
```javascript
  var express = require('express');
  var router = express.Router();

  /* GET home page. */
  router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
  });

  module.exports = router;
```
  - router 객체는 express.Router()로 만든다.
  - app.use() 처럼 router 하나에 여러 미들웨어를 여러 개 장착 가능
  - 실제 라우터 로직이 실행되는 미들웨어 전에 로그인 여부 또는 관리자 여부를 체크하는 미들웨어를 중간에 넣어두곤 한다.
  - Ex. router.get('/', middleware1, middleware2, middleware3);

### 라우터는 반드시 요청에 대한 응답을 보내거나 에러 핸들러로 요청을 넘겨야 함.
- 응답을 보내지 않으면 브라우저는 계속 응답을 기다린다.
- res 객체에 들어 있는 메서드들로 응답을 보낸다.

### next() 메서드에는 라우터에서만 동작하는 특수한 기능이 있다.
- next('route');
  - 라우터에 연결된 나머지 미들웨어를 건너뛰고 싶을 때 사용한다.
  ```javascript
    router.get('/', function(req, res, next){
      next('route');
    }, function(req, res, next){
      console.log('실행되지 않음');
      next();
    }, function(req, res, next){
      console.log('실행되지 않음');
      next();
    });

    router.get('/', function(req, res){
      console.log('실행된당~');
      res.render('index', {title: 'Express'});
    });
  ```
  
### 라우터 주소에는 특수한 패턴을 사용할 수 있음. (그 중 하나)
```javascript
 router.get('/users/:id', function(req, res){
   console.log(req.params, req.query);
 })
```
  - 주소에 :id가 의미하는 것은 id값으로 해당 URL의 값이 들어온다는 것이다.
  - Ex. http://localhost:3000/users/first_user
  - req.params.id의 값은 first_user이다. { id: 'first_user' }
  - 다양한 라우터를 아우르는 와일드카드 역할을 하므로 일반 라우터보다는 뒤에 위치해야 다른 라우터를 방해하지 않음!!

  ### 응답 메서드는 send, sendFile, json, redirect, render 등이 있다.
  - send는 만능 메서드
    - 버퍼의 데이터나 문자열을 전송하거나, HTML 코드, JSON 데이터 등을 전송 가능
  - sendFile : 파일을 응답으로 보내주는 메서드
  - json : JSON 데이터를 전송
  - redirect : 응답을 다른 라우터로 보낸다.
  - render : 템플릿 엔진을 렌더링할 때 사용
    - views 디렉토리 안 pug 확장자를 가지고 있는 파일들이 템플릿 엔진이다.

## 템플릿 엔진 사용하기
### Pug(Jade)
- HTML 문법과 많이 달라서 호불호가 갈림..

#### 설정
```javascript
  //app.js
  ...
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'pug');
```
- views는 템플릿 파일들이 위치한 폴더를 지정하는 것이다.
  - response.render 메서드가 이 디렉터리를 기준으로 템플릿 엔진을 찾아서 렌더링 한다.
  - Ex. response.render('index') 이면 views/index.pug를 렌더링 한다.
- view engine은 어떠한 종류의 템플릿 엔진을 사용할지를 나타낸다.

#### HTML 표현
- 기존 HTML 과 다르게 화살괄호(< >)와 닫는 태그가 없음.
  - 탭 또는 스페이스로만 부모-자식 관계를 규명(탭 한 번, 스페이스 두 번 또는 네번 모두 상관X)
  - 자식 태그는 부모 태그보다 들여쓰기 되어 있어야 한다.
  - pug : index.pug
  ```pug
    doctype html
    html
      head
        title= title
        link(rel='stylesheet', href='/stylesheet/style.css')
  ```
  - html : index.html
  ```html
    <!DOCTYPE html>
    <html>
      <head>
        <title>익스프레스</title>
        <link rel="stylesheet" href="/stylesheet/style.css"/>
      </head>
    </html>
  ```
- 속성 중 아이디와 클래스가 있는 경우 div 태그인 경우 div 문자는 생략 가능
  ```pug
    #login-button
    .post-image
    span#highlight
    p.hidden.full
  ```
- html
  ```html
   <div id="login-button"></div>
   <div class="post-image"></div>
   <span id="highlight"></span>
   <p class="hidden full"></p>
  ```

- HTML 텍스트는 다음과 같이 태그 또는 속성 뒤에 한 칸을 띄우고 입력
  ```
    // pug
    p Welcome to Express
    button(type='submit') 전송
  ```
  ```html
    //html
    <p> Welcome to Express </p>
    <button type="submit">전송</button>
  ```
  
- 에디터에서 텍스트를 여러 줄 입력하고 싶다면 파이프(|)를 넣어준다.
  - pug
    ```pug
      p
       | 안녕하세요.
       | 이것이 여러 줄로 입력하는 방법이라네요.
       | 신기합니다. 증말
    ```
  - html
    ```html
      <p> 안녕하세요. 여러 줄을 입력하는 방법이라네요. <br> 태그도 중간에 넣을 수 있답니다.</p>
    ```
#### 변수
- HTML과는 다르게 자바스크립트 변수를 템플릿에 렌더링할 수 있음.
  - res.render 호출 시 보내는 변수를 Pug가 처리해준다.
  - Ex. routes/index.js
    ```javascript
     router.get('/', function(req, res, next){
       res.render('index', {title: 'Express'})
     })
    ```
  - res.render(템플릿, 변수 객체);는 익스프레스가 res 객체에 추가한 템플릿 렌더링을 위한 메서드이다.
- res.render 메서드에 두 번째 인자로 변수 객체를 넣는 대신, app.js에 에러 처리 미들웨어처럼 res.locals 객체를 사용해서 변수를 넣을 수도 있음.
  ```javascript
      router.get('/', (req, res, next) => {
        res.locals.title = 'Express';
        res.render('index');
      })
  ```
  - 현재 라우터뿐만 아니라 다른 미들웨어에서도 res.locals 객체에 접근할 수 있음.
    - 다른 미들웨어에서 템플릿 엔진용 변수를 미리 넣을 수도 있다는 것.
  
  - Pug에서 변수를 사용하는 방법
    - pug
      ```pug
        h1= title
        p Welcome to #{title}
        button(class=title, type='submit') 전송
        input(placeholder=title + ' 연습')
      ```
    - html
      ```html
        <h1>Express</h1>
        <p>Welcome to Express<p>
        <button class="Express" type="submit">전송</button>
        <input placeholder="Express 연습">
      ```
  - 변수를 텍스트로 사용하고 싶다면 태그 뒤에 =을 붙인 후 변수를 입력한다.
    - 속성에도 =을 붙인 후 변수를 사용할 수 있다.
  - 속성에도 =을 붙인 후 변수를 사용할 수 있다.
  - 텍스트 중간에 변수를 넣으려면 ${변수}를 사용하면 된다.

  - 내부에 직접 변수 선언 가능 : 뺴기(-)를 먼저 입력하면 뒤에 자바스클비트 구문을 작성 가능
    - pug
      ```
        - var node = 'Node.js'
        - var js = 'JavaScript'
        p #{node}와 #{js}
      ```