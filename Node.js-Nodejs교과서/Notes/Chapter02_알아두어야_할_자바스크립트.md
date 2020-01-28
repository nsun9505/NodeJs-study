# Chapter 02. 알아두어야 할 자바스크립트
## ES2015+
### const, let
- 예제
```javascript
    if(true)
        var x = 5;
    console.log(x); // 5 출력
    if(true)
        const y = 10;
    console.log(y);     // ERROR
```
  - var은 함수 스코프를 가지므로 if문의 블록과 관계없이 접근 가능...
  - const, let은 블록 스코프를 가지므로 블록 밖에서는 변수에 접근할 수 없음.
- const, let 차이점
  - const는 한 번 초기화하면 다른 값을 대입할 수 없음(상수)
  - let은 초기화를 하더라도 다른 값을 대입할 수 있음.(변수)

### 템플릿 문자열
- ``으로 문자열 표현 가능 또한 ${변수}와 같이 안에 변수를 사용할 수 있음.
- 예제
```javascript
    const num1 = 1;
    const num2 = 2;
    const ret = num2 - num1;
    const str = `${num2} 빼기 ${num1}은 ${ret}이다.`
    console.log(str);
```

### 객체 리터럴
- 객체 메서드에 함수를 연결할 떄 콜론(:)과 function을 붙이지 않아도 된다.


### 화살표 함수(arrrow function)
- 예제
```javascript
// 이전
function task1(x, y){
    return x + y;
}

// arrow function
const task2 = (x, y) => { 
    x+y;
}
```
- this를 사용해야 하는 경우에는 arrow function과 함수 선언문 둘 중에 하나를 고르면 된다.

### 비구조화 할당
- 객체와 배열로부터 속성이나 요소를 쉽게 꺼낼 수 있다.

### 프로미스
- ES2015부터는 자바스크립트와 노드의 API들이 콜백 대신 프로미스(promise)를 기반으로 재구성된다.
- 프로미스 규칙
```javascript
    const cond = true;
    const promise = new Promise((resolve, reject) => {
        if(cond)
            resolve('success');
        else
            resolve('fail');
    });

    promise.then((message) => {
        console.log(message);
    }).catch(error) => {
        console.log(error);
    };
```
  - 프로미스 내부에서 resolve가 호출되면 then이 호출되고, reject가 호출되면 catch가 호출된다.
  - then이나 catch에서 다시 다른 then이나 catch를 붙일 수 있음.
    - 이전 then의 반환 값을 다음 then의 매개변수로 넘긴다.
    - 프로미스를 return한 경우 프로미스가 수행된 후 다음 then이나 catch가 호출된다.
    ```javascript
        primise.then((messge) => {
            return new Promise((resolve, reject) ={
                reslove(message);
            });
        })
        .then((message2) => {
            console.log(message2);
            return new Promise((resolve, reject) => {
                resolve(message2);
            });
        })
        .then((message3) => {
            console.log(message3);
        })
        .catch((error) => {
            console.log(error);
        })
    ```
    - 처음 then()에서 message를 resolve하면 다음 then에서 받을 수 있음.
    - 다시 message2를 resovle했으므로 다음 then에서 message3을 받습니다.

- 콜백을 프로미스로 바꾸기
```javascript
    // 콜백 사용, 콜백의 세 번 중첩...
    function fundAndSaveUser(users){
        users.findOne({}, (err, user) => {
            if(err) return console.log(err);

            user.name = 'nam';
            user.save((err)=>{
                if(err) return console.log(err);
                user.findOne({ sex: 'M'}, (err, user) => {
                    console.log(user);
                })
            })
        })
    }

    // 프로미스 사용
    function findAndSaveUser(users){
        users.findOne({}).then((user) => {
            user.name = 'nam';
            return user.save();
        })
        .then((user) => {
            return users.findOne({ sex: 'M'});
        })
        .then((user) => {
            console.log(user);
        })
        .catch(err => {
            console.log(err);
        })
    }
```
  - then 메서드들은 순차적으로 실행된다.
  - 콜백에서 따로 처리해야 했던 에러도 마지막 catch에서 한 번에 처리 가능
  - 메서드가 프로미스 방식을 지원해야 콜백 함수를 프로미스 형식으로 변경 가능

- 프로미스 여러 개를 한 번에 실행하기(Promise.all)
```javascript
    const p1 = Promise.resolve('success1');
    const p2 = Promise.resolve('success2');
    Promise.all([p1, p2])
        .then((result) => {
            console.log(result);
        })
        .catch((err) => {
            console.log(err);
        }
```

### async/await
- async/await 문법은 프로미스를 사용한 코드를 한 번 더 깔끔하게 만들어 준다.
- 프로미스 코드에 async/await 적용
```javascript
function findAndSaveUser(users){
        users.findOne({}).then((user) => {
            user.name = 'nam';
            return user.save();
        })
        .then((user) => {
            return users.findOne({ sex: 'M'});
        })
        .then((user) => {
            console.log(user);
        })
        .catch(err => {
            console.log(err);
        })
    }

    // await/async 적용
    async function findAndSaveUser(users){
        try{
            let user = await users.findOne({});
            user.name = 'nam';
            user = await user.save();
            user = await users.findOne({sex: 'M'});
        } catch(error){
            // error handling
        }
    }
```
  - 함수는 해당 프로미스가 resolve될 때까지 기다렸다가 다음 로직 수행
   Ex. awiat users.findOne({});이 resolve될 때까지 기다린 뒤, user 변수를 초기화
  - 프로미스의 catch 메서드처럼 try/catch문의 catch가 에러를 처리
  