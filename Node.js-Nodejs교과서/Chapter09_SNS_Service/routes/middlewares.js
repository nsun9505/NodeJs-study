// 로그인 중이면 request.isAuthenticated()가 true,
// 로그인 상태가 아니라면 request.isAuthenticated()가 false 리턴
exports.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated())
        next()
    else
        res.status(403).send('로그인 필요')
}

exports.isNotLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated())
        next()
    else
        res.redirect('/')
}