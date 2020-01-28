var express = require('express');
var app = express();
var bodyparser = require('body-parser');
var session = require('express-session');
var fs = require('fs');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

var server = app.listen(3000, function(){
    console.log('server has started on port 3000');
});

// 정적 파일을 다루기 위해 express.static() 메서드를 사용한다.
app.use(express.static('public'));

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: false}));
app.use(session({
    secret: '@#@$MYSIGN$@$#$',      // 쿠키를 임의로 변조하는 것을 방지하기위한 sign 값
    resave: false,                  // 세션을 언제나 저장할지(변경되지 않아도) 정하는 값
                                    // express-session documentation에서는 이 값을 false로 하는 것을 권장
    saveUninitialized: true         // uninitialized 세션이란 새로 생겼지만 변경되지 않는 세션을 의미
                                    // documentation에서 이 값을 true로 설정하는 것을 권장
}));

var router = require('./router/main')(app, fs);