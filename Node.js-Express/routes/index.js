var express = require('express')
var router = express.Router();
var template = require('../lib/template.js');
var auth = require('../lib/auth');

router.get('/', function (request, response) {
  // deserializeUser를 통해서 done 함수의 두 번째 인자로 전달한 값이
  // request.user의 값으로 확인이 가능하다.
  // 그래서 request.user의 값이 있다면 로그인이 된 것을 알 수 있다.
  console.log('/', request.user);
  var fmsg = request.flash();
    var feedback = '';
    if(fmsg.success){
        feedback = fmsg.success[0];
    }
  var title = 'Welcome';
  var description = 'Hello, Node.js';
  var list = template.list(request.list);
  var html = template.HTML(title, list,
    `
      <div style="color:blue;>${feedback}</div>
      <h2>${title}</h2>${description}<br>
      <img src="/images/hello.jpg" style="width:300px;">
      `,
    `<a href="/topic/create">create</a>`,
    auth.StatusUI(request, response));
  response.send(html);
})

module.exports = router;