# EXPORESS API

## app.get() : 라우터와 같은 역할
```javascript
app.get('/', function(req, res){ 
  return res.send('Hello World!')
})

OR

// localhost:3000/page로 라우팅
app.get('/page', function(req, res){ 
  return res.send('/page')
})

```
- 이전 코드

```javascript
    if(pathname === '/'){ ... }
    else if(pathname === '/page') { ... }
    else if(...)
```
  - 위의 코드와 같이 if-else if문이 중복되면 가독성이 매우 떨어짐.
  - 하지만 app.get()을 사용하면 가독성 향상은 물론 코드 작성에도 매우 유용


## URL통해 파라미터 전달 = URL PATH 파라미터 전달
```javascript
app.get('/page/:pageId', function(request, response){ 
 response.send(request.params)
})
```
  - Ex : http://localhost/page/HTML 이라고 주소창에 입력하게 되면
    - {"pageId" : "HTML"}라고 웹 브라우저 화면에 출력된다.
    - 즉 pageId의 값이 HTML이라는 것을 알 수 있게 된다.
    - 참조 : https://expressjs.com/ko/guide/routing.html

## GET / POST 방식
```javascript
// get 방식으로 /create에 접근 시 수행하게 된다.
app.get('/create', function(request, response){
    // code
})
// post 방식으로 /create에 접근 시 수행하게 된다.
app.post('/create', function(request, response){
    // code
})
```

## redirect
```javascript
    response.redirect(`/page/${title}`)
```