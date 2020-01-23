# post 데이터 받기
```
var qs = require('querystring');
var body = '';

// 받은 데이터를 저장
reques.on('data', function(data){
	body += data;
});

// post로 넘어온 모든 데이터를 받았다면 각 입력에 맞게 
// 변수로 저장 가능
reques.on('end', function(){
	var post = qs.parse(body);			// parsing
	var title = post.title;				// input 태그의 name 속성 값
	var description = post.description;	// input 태그의 name 속성 값
});
```
