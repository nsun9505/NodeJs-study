# Object Oriented Programming
## 자바스크립트에서는 조건문은 변수에 담을 수 없음.
- while문 또한 담을 수 없음.

## 배열에 원소로서 함수가 존재 가능
```javascript
    var f = function(){
        console.log(1);
    }
    var a = [f];
    a[0](); // f() 실행

    var o = {
        func:f
    }
    o.func();
```