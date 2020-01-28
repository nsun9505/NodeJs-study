```
 npm install express --save
```

## 예제 코드
```javascript
const express = require('express')
const app = express()

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(3000, () => console.log('Example app listening on port 3000!!'))
```

### http://localhost:3000/page/HTML
- HTML 파일 내용을 뿌려주기