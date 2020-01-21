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
- 파일이 생성 됨.
  - 파일이 생성되지 않는다면 권한 확인할 것.

# Redirection
```
fs.writeFile(`data/${title}`, description, 'utf8', function(err){
          // page redirection
          response.writeHead(302, {Location: `/?id=${title}`});
          response.end('success');
        });
```
