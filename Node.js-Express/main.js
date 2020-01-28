var express = require('express')
var app = express()
var fs = require('fs');
var bodyParser = require('body-parser');
var compression = require('compression');
var session = require('express-session')
var FileStore = require('session-file-store')(session)
var flash = require('connect-flash');
var helmet = require('helmet');
app.use(helmet());

// static file
// 정적인 파일을 웹에서 서비스할 때 정적인 파일을 서비스하고자하는 디렉토리를 지정
// public 아래에 있는 디렉토리나 파일을 URL을 접근 가능 나머지는 불가능
app.use(express.static('public'));
// compression 
app.use(compression())
// form
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: new FileStore()
}))

// flash를 미들웨어로 설치
// flash에서는 데이터를 일회용으로 사용
app.use(flash());
app.get('/flash', function(req, res){
  // Set a flash message by passing the key, followed by the value, to req.flash().
  // info라는 것에 Flash is back이라는 메시지를 추가한다.
  // flash 메소드를 호출하면 첫 번쨰 인자의 이름으로 두 번쨰 인자의 값을 가지게 한다.
  req.flash('msg', 'Flash is back!!');
  res.send('flash');
});

app.get('/flash-display', function(req, res){
  // 세션에서 데이터가 삭제된다.
  var fmsg = req.flash();
  console.log(fmsg);
  res.send(fmsg);
  // Get an array of flash messages by passing the key to req.flash()
//  res.render('index', { messages: req.flash('info') });
});

var passport = require('./lib/passport')(app);
var topicRouter = require('./routes/topic');
var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth')(passport);

// get에 대한 모든 요청은 파일 목록을 가져오는 행동을 함.
app.get('*', function (request, response, next) {
  fs.readdir('./data', function (error, filelist) {
    request.list = filelist;
    next();
  })
})

app.use('/', indexRouter);
app.use('/auth', authRouter);
// /topic으로 시작하는 URL은 topicRouter 미들웨어에게 맡긴다?
app.use('/topic', topicRouter);

// 찾을 수 없는 것에 대해서는 모두 404 처리
// 미들웨어는 순차적으로 수행되기 때문에 여기까지 오면 못 찾을 것이므로 
// 404 status를 보내는 것이다.
app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!")
})

// error를 next(error)로 처히한 경우 실행되는 함수.
// 인자가 4개인 미들웨어를 실행하게 되어 있음.
app.use(function (err, req, res, next) {
  console.log(err.stack);
  res.status(500).send('Something broke!');
})

app.listen(3000, () => console.log('Example app listening on port 3000!!')) 