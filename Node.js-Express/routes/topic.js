 var express = require('express')
 var router = express.Router();
 var path = require('path');
 var sanitizeHtml = require('sanitize-html');
 var template = require('../lib/template.js');
 var fs = require('fs');
 var auth = require('../lib/auth');

 // get 방식으로 /create에 접근 시 수행하게 된다.
 router.get('/create', function(request, response){
  if(!auth.IsOnwer(request, response)){
    response.redirect('/');
    return false;
  }
    var title = 'WEB - create';
    var list = template.list(request.list);
    var html = template.HTML(title, list, `
        <form action="/topic/create" method="post">
          <p><input type="text" name="title" placeholder="title"></p>
          <p>
            <textarea name="description" placeholder="description"></textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
      `, '', auth.StatusUI(request,response));
    response.send(html);
  });
  
  // post 방식으로 //topic/create에 접근 시 수행하게 된다.
  router.post('/create', function(request, response){
    if(!auth.IsOnwer(request, response)){
      response.redirect('/');
      return false;
    }
    var post = request.body;
    var title = post.title;
    var description = post.description;
    fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
      response.redirect(`/topic/${title}`);
    })
  })
  
  // get 방식으로 /create에 접근 시 수행하게 된다.
  router.get('/update/:pageId', function(request, response){
    if(!auth.IsOnwer(request, response)){
      response.redirect('/');
      return false;
    }
    var filteredId = path.parse(request.params.pageId).base;
    fs.readFile(`data/${filteredId}`, 'utf8', function (err, description) {
      var title = request.params.pageId;
      var list = template.list(request.list);
      var html = template.HTML(title, list,
        `
          <form action="/topic/update" method="post">
            <input type="hidden" name="id" value="${title}">
            <p><input type="text" name="title" placeholder="title" value="${title}"></p>
            <p>
              <textarea name="description" placeholder="description">${description}</textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
          `,
        `<a href="/topic/create">create</a> <a href="/topic/update/${title}">update</a>`
        , auth.StatusUI(request,response));
      response.send(html);
    });
  });
  
  // update process
  router.post('/update', function(request, response){
    if(!auth.IsOnwer(request, response)){
      response.redirect('/');
      return false;
    }
    var post = request.body;
    var id = post.id;
    var title = post.title;
    var description = post.description;
    fs.rename(`data/${id}`, `data/${title}`, function (error) {
      fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
        response.redirect(`/topic/${title}`)
      })
    });
  });
  
  router.post('/delete_process', function(request, response){
    if(!auth.IsOnwer(request, response)){
      response.redirect('/');
      return false;
    }
    var post = request.body;
    var id = post.id;
    var filteredId = path.parse(id).base;
    fs.unlink(`data/${filteredId}`, function (error) {
      response.redirect(`/`)
    })
  });
  
router.get('/:pageId', function (request, response, next) {
  var filteredId = path.parse(request.params.pageId).base;
  fs.readFile(`data/${filteredId}`, 'utf8', function (err, description) {
    if (err) {
      next(err);
    } else {
      var title = request.params.pageId;
      var sanitizedTitle = sanitizeHtml(title);
      var sanitizedDescription = sanitizeHtml(description, {
        allowedTags: ['h1']
      });
      var list = template.list(request.list);
      var html = template.HTML(sanitizedTitle, list,
        `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
        ` <a href="/topic/create">create</a>
            <a href="/topic/update/${sanitizedTitle}">update</a>
            <form action="/topic/delete_process" method="post">
              <input type="hidden" name="id" value="${sanitizedTitle}">
              <input type="submit" value="delete">
            </form>`,
            auth.StatusUI(request,response)
      );
      response.send(html);
    }
  });
});

  module.exports = router;
  