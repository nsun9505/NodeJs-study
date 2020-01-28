
module.exports = {
    IsOnwer: function (request, response) {
        if (request.user)
            return true;
        else
            return false;
    },
    StatusUI: function (request, response) {
        var _authStatusUI = '<a href="/auth/login">login</a>';
        if (this.IsOnwer(request, response))
            _authStatusUI = `${request.user.nickname} | <a href="/auth/logout">logout</a>`
        return _authStatusUI;
    }
}