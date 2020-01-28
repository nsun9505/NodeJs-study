# Middleware
## body-parser
- 사용자가 전송한 데이터를 내부적으로 해석해서 콜백 함수 호출
- 설치
```
 $ npm install body-parser --save
```

- 사용
```javascript 
 var bodyParser = require('body-parser');
 var express = require('express');
 var app = express();

 // form
app.use(bodyParser.urlencoded({extended: false}));

// json
//app.use(bodyParser.json());

```
- 내부적으로 body-parser가 동작

### 코드의 변화
```javascript
// 이전 
var body = '';
  request.on('data', function(data){
      body = body + data;
  });
  request.on('end', function(){
      var post = qs.parse(body);
      var title = post.title;
      var description = post.description;
      fs.writeFile(`data/${title}`, description, 'utf8', function(err){
        response.writeHead(302, {Location: `/?id=${title}`});
        response.end();
      })
  });
// 이후
var post = request.body;
  var title = post.title;
  var description = post.description;
  fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
    response.redirect(`/page/pageId${title}`);
  })
```
- app.use()를 사용할 경우 request에 body라는 필드가 생겨서 사용할 수 있음.


## Compression
### 설치
```
 $ npm install compression --save
```

### 사용 방법
```javascript
var exporess = require('express');
var app = express();
var compression = require('compression');

app.use(compression())
```
- 데이터가 사용자에게 압축되어 전송되므로 패킷의 크기를 줄일 수 있다.

## middleware 만들기
- 형식
```javascript
var myLogger = function (req, res, next) {
  console.log('LOGGED')
  next()
}

app.use(myLogger)
```
  - myLogger와 같은 형식을 가지고 있는 함수를 선언하면 미들웨어를 만들 수 있다.
  - function에는 request, response, next를 순서대로 인자를 받는다.
  - 모든 것을 처리하기 위해서는 use()를 사용해도 되지만
  - get(), post()를 사용한 뒤 첫 번째 인자에 '*'를 사용한다면 get이 들어오면 먼저 처리하고 해당 처리를 하게 된다.
  - 참조 : http://expressjs.com/en/guide/writing-middleware.html4

### 참조 : http://expressjs.com/en/guide/using-middleware.html
