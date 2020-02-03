const local = require('./localStrategy')
const { User } = require('../models')

module.exports = (passport) => {
    // req.session 객체에 어떤 데이터를 저장할지 선택
    // 매개변수로 user를 받아, done 함수에 두 번째 이자로 user.id를 넘김.
    // done 함수의 첫 번째 인자는 에러 발생 시 사용하는 것이므로 두 번째 인자가 중요
    // 세션에 사용자 정보를 모두 저장하면 세션의 용량이 커지고 데이터 일관성에 문제가 발생하므로
    // 사용자의 아이디만 저정
    passport.serializeUser((user, done) => {
        done(null, user.id);
    })

    // 매 요청 시 실행된다.
    // passport.session() 미들웨어가 이 메서드를 호출한다.
    // serializeUser에서 세션에 저장했던 아이디를 받아 데이터베이스에서 사용자 정보를 조회
    // 조회한 정보를 req.user에 저장하므로 앞으로 req.user를 통해 로그인한 사용자의 정보를 가져올 수 있음.
    passport.deserializeUser((id, done) => {
        User.findOne({ where: { id }})
            .then(user => done(null, user))
            .catch(err => done(err))
    })

    // 

    local(passport);
}