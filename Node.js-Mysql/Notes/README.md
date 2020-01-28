# 필기 자료입니다.

# 20.1 보안
## SQL Injection
```javascript
var query = db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?`, [queryData.id], function (err2, topic)
```
- 위와 같이 ?와 같이 치환하는 방식을 사용해야 SQL INJECTION을 막을 수 있다.

#### SQL INJECTION 취얌
```javascript
var query = db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=${queryData.id}`, function (err2, topic){ }
```
- 위와 같이 작성 했을 때 id 값에 파라미터로 SQL 문을 입력해도 실행되지 않음.
- 왜냐하면 mysql에 데이터베이스에 연결할 때 multiplestatements를 키지 않는 이상 한 번에 하나의 SQL만
  실행되기 때문이다.
  - 하지만 multiplestatements를 on하면 한 번에 여러 개의 sql이 실행되므로 절대 키지 않도록 한다.

#### 위와 같은 문장을 사용해야한다면 escape()를 사용하면 파라미터로 sql을 전달해도 실행되지 않는다.
- id 값으로 "1;DROP TABLE TOPIC;"을 전달하게 된다면  
```javascript
    var query = db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=${db.escape(ueryData.id)}`, function (err2, topic){ 
    }
    console.log(query.sql);
```
- 위의 방식대로 escape()를 사용해서 코딩한 경우 console.log(query.sql)의 결과는 아래와 같다.
```sql
    SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id='1;DROP TABLE TOPIC;'
```

#### 가장 추천하는 방식은 ?를 사용하는 방법
```javascript
    db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?`,       [queryData.id], function (err2, topic) {
        if (err2) throw err2;
    });
``` 

## escaping 
### 저장된 정보가 밖으로 보여질 때 악의적인 정보가 포함된 경우에 대한 보안 적용
#### sanitize-html
- 사용자가 입력한 정보가 웹에서 나타날 때 <script></script>와 같은 문장에 대해서 필터링을 하는 모듈
```javascript
    //사용예시
    // 아래는 데이터베이스에 저장된 author의 정보를 가져오는 함수이다.
    // name, profile은 데이터베이스에 저장되어 있고, 사용자가 어떤 값을 입력한 것인지는 모르기 때문에
    // 아래와 같이 sanitizeHtml(...)을 사용해서 필터링한다.
    
    var sanitizeHtml = require('sanitize-html');
    ...
    authorTable: function (authors) {
    var tag = '<table>';
    for (var i = 0; i < authors.length; i++) {
      tag += `
                <tr>
                    <td>${sanitizeHtml(authors[i].name)}</td>
                    <td>${sanitizeHtml(authors[i].profile)}</td>
                    <td><a href="/author/update?id=${authors[i].id}">update</a></td>
                    <td>
                     <form action="/author/delete_process" method="post">
                      <input type="hidden" name="id" value="${authors[i].id}">
                      <input type="submit" value="delete">
                     </form>
                    </td>
                </tr>
                `;
    }
    tag += `</table>`;
    return tag;
  }
```