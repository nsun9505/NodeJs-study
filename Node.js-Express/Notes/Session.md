# Session

## session 사용법
```javascript
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))
```
- secret : [필수 옵션] 자기만 가지고 있어야하는 것
  - 버전 관리 시 정보가 노출되지 않도록 주의
- resave : false = session data가 바뀌기 전까지는 세션 저장소에 저장하지 않음.
- saveUninitialized : 세션이 필요하기 전까지는 세션을 구동시키지 않는다.

## session 저장소에 값 저장
```javascript
app.get('/', function (req, res, next) {
    console.log(req.session);
    if(req.session.num === undefined){
        req.session.num = 1;
    } else {
        req.session.num = req.session.num  + 1;
    }
    res.send(`Views : ${req.session.num}`)
})
```
- 값은 메모리에 저장되어 있음. 서버가 꺼졌다가 켜지면 값이 날아감.
- 휘발성 저장매체보다는 비휘발성 저장매체에 저장하는 것이 좋음.
- 또한, 여러 가지 저장 방법이 있음.(Ex. File, etc..)