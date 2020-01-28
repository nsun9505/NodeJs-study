# 보안
- express를 최신 버전으로 사용할 것
- http 보다는 https(SSL OR TLS OR HTTPS)
- Use Helmet
- cookie를 올바르게 사용
- 의존성 보안 : nsp 사용

## Helmet
- 설치
```sh
 $ npm install --save helmet
```

- 적용
```javascript
 var helmet = reqire('helmet');
```