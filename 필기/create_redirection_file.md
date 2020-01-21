# 파일생성과 리다이렉션
```
  var body = '';
      // data set
      request.on('data', function(data){
        body = body + data;
      });

      // data setting end
      request.on('end', function(){
        var post = qs.parse(body);
        var title = post.title;
        var description = post.description;
        fs.writeFile(`data/${title}`, description, 'utf8', function(err){
			response.writeHead(200);
			response.end('success');
        });
      });
```
