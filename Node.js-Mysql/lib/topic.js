var url = require('url');
var db = require('./db')
var template = require('./template')
var qs = require('querystring');
var sanitizeHtml = require('sanitize-html');

// 여러개를 내보낸다? = exports
// 하나만 내보낸다 = module.exports
exports.home = function (request, response) {
    db.query(`SELECT * FROM topic`, function (err, topics, fields) {
        if (err) throw err;
        var title = 'Welcome';
        var description = 'Hello, Node.js';
        var list = template.list(topics);
        var html = template.HTML(title, list,
            `<h2>${title}</h2>${description}`,
            `<a href="/create">create</a>`
        ); console.log(topics);
        response.writeHead(200);
        response.end(html);
    });
}

exports.page = function (request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    db.query(`SELECT * FROM topic`, function (err, topics, fields) {
        if (err) throw err;
        // ?의 값이 무엇인지는 query 함수의 두 번째 인자에 [ ] 배열로 전달한다.
        var query = db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?`, [queryData.id], function (err2, topic) {
            if (err2) throw err2;

            var title = topic[0].title;
            var description = topic[0].description;
            var list = template.list(topics);
            var html = template.HTML(title, list,
                `<h2>${sanitizeHtml(title)}</h2>
              ${sanitizeHtml(description)}
              <p>by ${sanitizeHtml(topic[0].name)}</p>
              `,
                `<a href="/create">create</a>
              <a href="/update?id=${queryData.id}">update</a>
              <form action="delete_process" method="post">
                <input type="hidden" name="id" value="${queryData.id}">
                <input type="submit" value="delete">
              </form>`
            );
            console.log(query.sql);
            response.writeHead(200);
            response.end(html);
        })
    });
}

exports.create = function (request, response) {
    db.query(`SELECT * FROM topic`, function (err, topics, fields) {
        db.query(`SELECT * FROM author`, function (err, authors) {
            if (err) throw err;
            var title = 'Create';
            var list = template.list(topics);
            var html = template.HTML(sanitizeHtml(title), list,
                `
          <form action="/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
              <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
                ${template.authorSelect(authors)}
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
          `,
                `<a href="/create">create</a>`
            );
            response.writeHead(200);
            response.end(html);
        })
    });
}

exports.create_process = function (request, response) {
    var body = '';
    request.on('data', function (data) {
        body = body + data;
    });
    request.on('end', function () {
        var post = qs.parse(body);
        db.query(`
           insert into topic (title, description, created, author_id) 
           values(?, ?, NOW(), ?);`,
            [post.title, post.description, post.author],
            function (err, results) {
                if (err) throw err;

                response.writeHead(302, { Location: `/?id=${results.insertId}` });
                response.end();
            });
    });
}

exports.update = function (request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    db.query(`SELECT * FROM topic`, function (err, topics) {
        if (err) throw err;

        db.query(`SELECT * FROM topic WHERE id=?`, [queryData.id], function (err2, topic) {
            if (err) throw err;
            db.query(`SELECT * FROM author`, function (err, authors) {
                var list = template.list(topics);
                var html = template.HTML(sanitizeHtml(topic[0].title), list,
                    `
            <form action="/update_process" method="post">
              <input type="hidden" name="id" value="${topic[0].id}">
              <p><input type="text" name="title" placeholder="title" value="${sanitizeHtml(topic[0].title)}"></p>
              <p>
                <textarea name="description" placeholder="description">${sanitizeHtml(topic[0].description)}</textarea>
              </p>
              <p>
                ${template.authorSelect(authors, topic[0].author_id)}
              </p>
              <p>
                <input type="submit">
              </p>
            </form>
            `,
                    `<a href="/create">create</a> <a href="/update?id=${topic[0].id}">update</a>`
                );
                response.writeHead(200);
                response.end(html);
            });
        });
    });
}

exports.update_process = function (request, response) {
    var body = '';
    request.on('data', function (data) {
        body = body + data;
    });
    request.on('end', function () {
        var post = qs.parse(body);
        db.query(`UPDATE topic SET title=?, description=?, author_id=? WHERE id=?`,
            [post.title, post.description, post.author, post.id],
            function (err, results) {
                response.writeHead(302, { Location: `/?id=${post.id}` });
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

        db.query(`DELETE FROM topic WHERE id=?`, [post.id], function (err, result) {
            if (err)
                throw err;

            response.writeHead(302, { Location: `/` });
            response.end();
        })
    });
}