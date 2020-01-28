module.exports = function (app) {

    var authData = {
        email: 'nsun9505@naver.com',
        password: '1234',
        nickname: 'nsun9505'
      }
      
    // 반드시 세션 뒤에 와야 함.
    // 세션을 내부적으로 활용하므로.
    // require는 먼저 선언되어도 괜찮음.
    var passport = require('passport')
        , LocalStrategy = require('passport-local').Strategy;

    // express에 passport 적재?
    app.use(passport.initialize());
    app.use(passport.session());

    // 로그인 성공 시 딱 한 번 호출. 사용자 식별자를 세션 스토어에 저장함.
    // 식별할 수 있는 값, 여기서는 user.email 값을 passport의 user 값을 저장함.
    passport.serializeUser(function (user, done) {
        console.log('serializeUser', user);
        // done의 두 번째 파라미터로 user를 식별 가능한 것을 전달한다.
        // 여기서는 email
        done(null, user.email);
    });

    // 세션에 저장된 정보를 기준으로 필요한 정보를 조회할 때 사용하는 함수
    // authData를 사용하기 위해 done 함수를 통해 전달.
    passport.deserializeUser(function (id, done) {
        console.log('deserializeUser', id);
        done(null, authData);
    });

    // local : username, password를 사용하여 로그인
    // 성공 시 /, 실패 시 /auth/login로 재진입
    // 추가적인 처리가 필요하다면 다음과 같은 방법 사용
    /*
    app.post('/login',
    passport.authenticate('local'),
    function(req, res) {
      // If this function gets called, authentication was successful.
      // `req.user` contains the authenticated user.
      res.redirect('/users/' + req.user.username);
    });
    */

    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'pwd'
    },
        function (username, password, done) {
            if (username === authData.email) {
                if (password === authData.password) {
                    return done(null, authData);
                } else {
                    return done(null, false, { message: 'Incorrect password' });
                }
            } else {
                return done(null, false, { message: 'Incorrect username' });
            }
        }
    ));
    return passport;
}