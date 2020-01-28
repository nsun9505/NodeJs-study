# Chapter 08. 몽고디비

## CRUD
- db.컬렉션명.save(다큐먼트)로 다큐먼트를 생성 가능

### 조회 : find
- find 메서드의 두 번째 인자로 조회할 필드를 넣는다. 
- 1 또는 true로 표시한 필드만 가져옴.
- _id는 기본적으로 가져오게 되어 있으므로 0 또는 false를 입력해 가져오지 않도록 한다.

### Update
- db.users.update({ name: 'zero'}, { $set: {comment: "하이 하이"}});
  - 첫 번째 객체는 수정할 다큐먼트를 지정하는 객체
  - 두 번째 객체는 수정할 내용을 입력하는 객체
  - $set 연산자 : 어떤 필드를 수정할지 정하는 연산자.

### Delete
- db.users.remove({name: 'nero'});
  - 삭제할 다큐먼트에 대한 정보가 담긴 객체를 첫 번째 인자로 제공

## 몽구스 사용하기
### mongoose 설치
  ```
    $ npm i mongoose
  ```

### 몽고디비 연결하기
- 주소 형식
    ```
        mongodb://[username:password@]host[:port][[/database][?options]]
    ```

### 스키마 생성
- schemas/user.js
  ```javascript
    const mongoose = require('mongoose');

    const { Schema } = mongoose;
    const userShema = new Schema({
        name: {
            type: String,
            require: true,
            unique: true
        },
        age: {
            type: Number,
            required: true
        },
        married: {
            type: Boolean,
            required: true
        },
        comment: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    });

    module.exports = mongoose.model('User', userShema);
  ```
  - 몽고스의 model 메서드로 스키마와 몽고디비 컬렉션을 연결하는 모델을 만든다.

- schemas/comments.js
  ```javascript
    const mongoose = require('mongoose');

    const { Schema } = mongoose;
    const { Type: { ObjectId } } = Schema;
    const commentsSchema = new Schema({
        commenter: {
            type: ObjectId,
            required: true,
            ref: 'User'
        },
        comments: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    })
    module.exports = mongoose.model('Comment', commentSchema);
  ```

### 쿼리 수행하기
- https://github.com/ZeroCho/nodejs-book/tree/master/ch8/8.6/learn-mongoose/views 참조
