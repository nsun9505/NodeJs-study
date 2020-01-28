# Error Handling
## 404
```javascript
// 찾을 수 없는 것에 대해서는 모두 404 처리
app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!")
})
```
  - 위와 같은 경우는 마지막에 위치시켜야함.
  - 왜냐하면 미들웨어는 순차적으로 수행되므로 404 status를 반환하는 것을 먼저실행하면 안 된다.

## 다른 방법
- 에러 발생 시 next 사용방법
```javascript
 fs.readFile(`data/${filteredId}`, 'utf8', function (err, description) {
    if(err){
      next(err);
    } else {
      var title = request.params.pageId;
    var sanitizedTitle = sanitizeHtml(title);
    var sanitizedDescription = sanitizeHtml(description, {
      allowedTags: ['h1']
    });
    var list = template.list(request.list);
    var html = template.HTML(sanitizedTitle, list,
      `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
      ` <a href="/create">create</a>
          <a href="/update/${sanitizedTitle}">update</a>
          <form action="/delete_process" method="post">
            <input type="hidden" name="id" value="${sanitizedTitle}">
            <input type="submit" value="delete">
          </form>`
    );
    response.send(html);
    }
  });

  ...

    // error를 next(error)로 처히한 경우 실행되는 함수.
    // 인자가 4개인 미들웨어를 실행하게 되어 있음.
    app.use(function(err, req, res, next){
        console.log(err.stack);
        res.status(500).send('Something broke!');
    })
```

