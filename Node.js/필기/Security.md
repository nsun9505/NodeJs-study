# Security
## 올바르지 않은 PATH 입력 방지
```javascript
 var path = require('path');
 path.parse("parsing...").base; // 파일명만 나옴.
```

## 오염된 정보가 들어올 때
### XSS 공격이 가능
- 본문에 <script></script> 태그로 정보 탈취 및 포워딩 가능
- 필터링 필요
  - '<'를 그대로 출력하거나 <script> 태그를 본문에서 제거
  - 수동으로 작업해야 하므로 비효율적

### npm을 통해 다른 사람이 만든 것을 이용한다.
- npm으로 설치
  ```
   $ npm init
   $ npm install - S sanitize-html
  ``` 
  - 옵션 
    -S : 프로젝트에서만 사용할 부품으로써 설치
    -g : global하게 설치

## API(Application Programming Interface)란 
- node js의 공식 문서에서 버전별 API 확인 가능