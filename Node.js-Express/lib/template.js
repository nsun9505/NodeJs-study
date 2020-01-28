var cookie = require('cookie');

module.exports = {
  HTML:function(title, list, body, control, authStatusUI='<a href="/auth/login">login</a>'){
    return `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      ${authStatusUI}
      <h1><a href="/">WEB</a></h1>
      ${list}
      ${control}
      ${body}
    </body>
    </html>
    `;
  },list:function(filelist){
    var list = '<ul>';
    var i = 0;
    while(i < filelist.length){
      list = list + `<li><a href="/topic/${filelist[i]}">${filelist[i]}</a></li>`;
      i = i + 1;
    }
    list = list+'</ul>';
    return list;
  }, authIsOnwer: function(request, response){
    var isOwner = false;
    var cookies = {};
    if(request.headers.cookie){
      cookies = cookie.parse(request.headers.cookie);
    }
    if(cookies.email === 'nsun9505@gmail.com' && cookies.password === '1234')
      isOwner = true;
  
    return isOwner;
  }
}
