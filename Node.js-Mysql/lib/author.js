
var db = require('./db')
var template = require('./template')
var qs = require('querystring');
var url = require('url');
var sanitizeHtml = require('sanitize-html');

// 여러개를 내보낸다? = exports
// 하나만 내보낸다 = module.exports
exports.home = function (request, response) {
    db.query(`SELECT * FROM topic`, function (err, topics) {
        if (err) { throw err; }

        db.query(`SELECT * FROM author`, function (err, authors) {

            var title = 'Author';
            var list = template.list(topics);
            var html = template.HTML(title, list,
                `${template.authorTable(authors)}
                <style>
                table{
                    border-collapse: collapse;
                }
                td{
                    border:1px solid black;
                    }
                </style>
                <form action="/author/create_process" method="post">
                    <p>
                        <input type="text" name="name" placeholder="name">
                    </p>
                    <p>
                        <textarea name="profile"></textarea>
                    </p>
                    <p>
                        <input type="submit">
                    </p>
                </form>
                `,
                ``
            );
            response.writeHead(200);
            response.end(html);
        });
    })
}

exports.create_process = function (request, response) {
    var body = '';
    request.on('data', function (data) {
        body = body + data;
    });
    request.on('end', function () {
        var post = qs.parse(body);
        db.query(`
           insert into author (name, profile) 
           values(?, ?);`,
            [post.name, post.profile],
            function (err, results) {
                if (err) throw err;

                response.writeHead(302, { Location: `/author` });
                response.end();
            });
    });
}

exports.update = function (request, response) {

    db.query(`SELECT * FROM topic`, function (err, topics) {
        if (err) { throw err; }
        db.query(`SELECT * FROM author`, function (err, authors) {
            var _url = request.url;
            var queryData = url.parse(_url, true).query;
            db.query(`SELECT * FROM author WHERE id=?`, [queryData.id], function (err, author) {
                var title = 'Author';
                var list = template.list(topics);
                var html = template.HTML(title, list,
                    `${template.authorTable(authors)}
                <style>
                table{
                    border-collapse: collapse;
                }
                td{
                    border:1px solid black;
                    }
                </style>
                <form action="/author/update_process" method="post">
                    <p>
                        <input type="hidden" name="id" placeholder="name" value="${queryData.id}"> 
                    </p>
                    <p>
                        <input type="text" name="name" placeholder="name" value="${sanitizeHtml(author[0].name)}">
                    </p>
                    <p>
                        <textarea name="profile">${sanitizeHtml(author[0].profile)}</textarea>
                    </p>
                    <p>
                        <input type="submit">
                    </p>
                </form>
                `,
                    ``
                );
                response.writeHead(200);
                response.end(html);
            });
        });
    })
}

exports.update_process = function (request, response) {
    var body = '';
    request.on('data', function (data) {
        body = body + data;
    });
    request.on('end', function () {
        var post = qs.parse(body);
        db.query(`UPDATE author SET name=?, profile=? WHERE id=?`,
            [post.name, post.profile, post.id],
            function (err, results) {
                response.writeHead(302, { Location: `/author` });
                response.end();
            })
    });
}

exports.delete_process = function (request, response) {
    var body = '';
    request.on('data', function (data) {
        body = body + data;
    });
    request.on('end', function () {
        var post = qs.parse(body);
        db.query(`DELETE FROM topic WHERE author_id=?`, [post.id], function (err, result) {
            if (err)
                throw err;

            db.query(`DELETE FROM author WHERE id=?`, [post.id], function (err, result) {
                if (err)
                    throw err;
                response.writeHead(302, { Location: `/author` });
                response.end();
            })
        });
    });
}