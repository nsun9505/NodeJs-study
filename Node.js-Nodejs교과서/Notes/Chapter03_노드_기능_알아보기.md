# Chapter 03. 노드 기능 알아보기
## REPL 사용하기
- 입력한 코드를 읽고(Read), 해석하고(Eval), 결과물을 반환하고(Print), 종료할 때까지 반복(Loop)한다고 해서 REPL(Read Eval Print Loop)이라고 부른다..

## 모듈로 만들기
### 모듈이란 특정한 기능을 하는 함수나 변수들의 집합
- 자체로도 하나의 프로그램이면서 다른 프로그램의 부품으로도 사용할 수 있다.
  - 즉, 재사용 가능
  - 보통 파일 하나가 모듈 하나가 된다.

```javascript
    // app.js
    var myModule = require('./var');
    console.log(myModule);      // '데이터' 출력

    // var.js
    const data = '데이터';
    module.exports = data;
```
  - require 함수 안에 불러올 모듈의 경로를 작성(파일 경로에서 js나 json과 같은 확장자 생략 가능)
  - module.exports에는 객체, 함수, 변수 대입 가능

  ## Node 내장 객체
  ### global
  - 브라우저의 window와 같은 전역 객체, 모든 파일에서 접근 가능
  - 이전에서 사용했던 require 함수에서도 global.require('/path/to/filename');에서 global이 생략된 것이다.
  

  ### __filename, __dirname
  - __fileanme : 현재 파일명
  - __dirname : 현재 파일 경로
  ```javascript
    console.log("current file : " + __filename);
    console.log("current dir : " + __dirname);
  ```

  ### modele, exports
  - 말 보다는 코드로
  ```javascript
    exports.test1 = "테스트1";
    exports.test2 = "테스트2";
  ```
    - module.exports로 한 번에 대입하는 대신, 각각의 변수를 exports 객체에 하나씩 넣음.
    - 동일하게 동작하는 이유는 module.exports와 exports가 동일한 객체르 참조하기 때문.
    
### process : 현재 실행되고 있는 노드 프로세스에 대한 정보를 담고 있음.
- porcess.env : 시스템의 환경 변수
- process.nextTick(callback) : 이벤트 루프가 다른 콜백 함수보다 nextTick의 콜백 함수를 먼저 처리하도록 만든다.
  - process.nextTick과 Promise를 microtask라고 따로 구분지어 부름.


## Node 내장 모듈
### os : 노드는 os 모듈에 운영체제의 정보를 가져올 수 있음.
- type(), hostname(), release(), 등의 정보를 알 수 있다.

### path : 디렉토리와 파이르이 경로를 쉽게 조작하도록 도와주는 모듈
- 사용하는 이유는 OS별로 경로 구분자가 다르기 때문에.


### url : 인터넷 주소를 쉽게 조작하도록 도와주는 모듈

### querystring : WHATWG 방식의 url 대신 기본 노드의 url을 사용할 떄 search 부분을 쉽게 객체로 만들어 주는 모듈
- querystring.parse(QUERY) : url의 query 부분을 자바스크립트 객체로 분해
- querystring.stringify(객체) : 분해된 query 객체를 문자열로 다시 조립해준다.

### crypto : 다양한 방식의 암호화를 도와주는 모듈
- 단방향 암호화 : 복호화할 수 없는 암호화 방식
  - createHash(알고리즘) : 사용할 해시 알고리즘을 넣어준다.
  - update(문자열) : 변환할 문자열을 넣어준다.
  - digest(인코딩) : 인코딩할 알고리즘을 넣어준다.(Ex. base64, hex 등)

# 파일 시스템 접근하기
## fs 모듈은 파일 시스템에 접근하는 모듈
- 파일을 생성/삭제/읽기/쓰기 등을 할 수 있음.
- 예제(read)
```javascript
 // sample.txt
 sample data

 // readFile.js
 const fs = require('fs');

 // 읽을 파일 경로 입력, 형식 지정, callback 함수 작성
 fs.readFile('./sample.txt', 'utf8', (err, data) => {
     if(err) throw err;

     console.log(data);
     console.log(data.toString());
 })
```

- 예제(write)
```javascript
    const fs = require('fs');
    // 생성될 파이르이 경로와 내용을 입력
    fs.writeFile('./write.txt', 'write test data', (err) => {
        if(err) throw err;
    });
    fs.readFile('./write.txt', (err, data) => {
        if(err) throw err;
        console.log(data);
    })    
```

### 동기 메서드와 비동기 메서드
- 비동기 메서드들은 백그라운드에 해당 파일을 읽으라고만 요청하고 당므 작업으로 넘어간다.
  - 나중에 읽기가 완료되면 백그라운드가 다시 메인 스레드에 알림을 준다.
  - 알림을 받은 메인 스레드는 등록된 콜백 함수를 실행.
  - 나중에 백그라운드가 각각의 요청 처리가 완료되었다고 알리면 그때 콜백 함수를 처리하면 된다.

### 버퍼와 스트림 이해
- readFile 메서드를 사용할 때 읽었던 파일이 버퍼 형식으로 출력됨.
  - 노드는 파일을 읽을 때 메모리에 파일 크기만큼 고간을 마련하고, 파일 데이터를 메모리에 저장한 후에 사용자가 조작할 수 있도록 해준다.
  - 메모리에 저장된 데이터가 버퍼이다.

- 버퍼를 직접 다루는 클래스 Buffer
  - 제공하는 메서드 
    - from(문자열) : 문자열을 버퍼로 바꿈.
    - toString(버퍼) : 버퍼를 다시 문자열로 바꿈.(인코딩 형식 지원 : base64, hex)
    - concat(배열) : 배열 안에 저장된 버퍼들을 하나로 합침.
    - alloc(Btyes) : 빈 버퍼를 생성. 바이트를 인자로 지정하면 해당 크기의 버퍼 생성

## 이벤트 이해하기
- 이벤트 고나리를 위한 메서드
  - on(이벤트명, 콜백) : 이벤트 이름과 이벤트 발생 시의 콜백을 연결(이벤트 리스닝)
  - addListener(이벤트 명, 콜백) : on과 기능 동일
  - emit(이벤트 명) : 이벤트를 호출하는 메서드. 이벤트 이름을 인자로 넣으면 해당 이벤트 리스너 동작
  - once(이벤트 명, 콜백) : 한 번만 실행되는 이벤트.
  - removeAllListeners(이벤트명) : 이벤트에 연결된 모든 이벤트 리스너 제거
  - removeListener(이벤트 명, 리스너): 이벤트에 연결된 리스너를 하나씩 제거
  - off(이벤트 명, 콜백) : removeListenr와 동일, node 10 버전에서 추가됨.
  - listenrCount(이벤트명) : 현재 리스너가 몇 개 연결되었는지 확인

## 예외 처리하기
- 에러가 발생할 것 같은 부분을 try/catch 문으로 감싸기
```javascript
    setInterval(() => {
        console.log('method start');
        try{
            throw new Error('ERORR!!!!!!!!!');
        }catch(err){
            console.error(err);
        }
    }, 2000)
```
- d에러 발생 시 철저히 기록(로깅)하는 습관을 들이고, 주기적으로 로그를 확인하면서 보완