# SNS 서비스 만들기

## dotenv
- 비밀키는 .env라는 파일에 모아두고, dotenv가 .env 파일을 읽어 process.env 객체에 넣는다.
- 쿠키 키와 같은 민감한 정보를 하드코딩하는 것은 좋지 않음.

### .env 파일에 "키=값" 형식으로 비밀키를 추가

### passport 설정
```javascript
    const { User } = require('../models')

    passport.serializeUser((user, done) => {
        done(null, user.id);
    })

    passport.deserializeUser((id, done) => {
        User.find({ where: { id }})
            .then(user => done(null, user))
            .catch(err => done(err))
    })
```
#### serializeUser
- req.session 객체에 어떤 데이터를 저장할지 선택
- 매개변수로 user를 받아, done 함수에 두 번째 인자로 session에 저장할 값을 전달한다.
- done 함수의 첫 번째 인자는 에러 발생 시 사용
- 세션에 사용자 정보를 모두 저장하면 세션의 용량이 커지고 데이터 일관성에 문제가 발생함.

#### deserializeUser
- 매 요청 시 실행된다.
- passport.session() 미들웨어가 이 메서드를 호출
- serializeUser에서 세션에 저장했던 값을 받아 데이터베이스에서 사용자 정보를 조회
- 조회한 정보를 req.user에 저장하므로 앞으로 req.user를 통해 로그인한 사용자의 정보를 가져올 수 있다.

#### 정리
- serializeUser는 사용자 정보 객체를 세션에 아이디로 저장
- deserializeUser는 세션에 저장한 아이디를 통해 사용자 정보 객체를 불러온다.

#### 로그인 과정
1. 로그인 요청
1. passport.authenticate 메서드 호출
1. 로그인 strategy 수행
1. 로그인 성공 시 사용자 정보 객체와 req.login 호출
1. req.login()가 passport.serializeUser 호출
1. req.session()에 사용자가 저장하고자 하는 값 저장
1. Login Success

#### 로그인 이후 과정
1. 클라이언트 요청에 passport.session() 미들웨어가 passport.deserializeUser() 호출
1. request.session()에 저장된 값(보통 ID)으로 데이터베이스나 파일에서 사용자 조회
1. 조회된 사용자 정보를 request.user에 저장
1. 라우터에서 request.user 객체 사용 가능

### Passport Local Strategy
- 다른 SNS 서비스를 통해 로그인하지 않고, 자체적으로 회원가입 후 로그인
  - passport-local 모듈 필요

- Passport는 request 객체에 login, logout 메서드를 추가함.
  - request.login()은 passport.serializeUser()를 호출
    - request.login()에 파라미터로 넘기는 user 객체가 serializeUser()로 전달된다.
  - request.logout()은 request.user를 제거
  - request.session.destroy()는 request.session() 객체의 내용을 제거
  
### Bcrypt 모듈
- hash(data, pdkdf2 반복 횟수)
  - pdkdf2 반복 횟수의 값은 커질수록 비밀번호를 알아내기 힘들지만 암호화 시간도 오래 걸림
  - 보통 12 이상을 추천. 최대 31까지 가능
