module.exports = function(app, Book){
    app.get('/api/books', function(req, res){
        Book.find(function(err, books){
            if(err)
                return res.status(500).send({error: 'database failure'});
            res.json(books);
        })
    })

    app.get('/app/books/:book_id', function(req, res){
        res.end();
    })

    app.get('/api/books/author/:author', function(req, res){

    })

    app.post('/api/books', function(req, res){
        var book = new Book();
        book.title = req.body.name;
        book.author = req.body.author;
        book.publicshed_date = new Date(req.body.publicshed_date);
        
        book.save(function(err){
            if(err){
                console.error(err);
                res.json({result: 0});
                return;
            }
            res.json({result: 1});
        })
    })

    app.put('/api/books/:book_id', function(req, res){
        res.end()
    })

    app.delete('/api/books/:book_id', function(req, res){
        res.end();
    })
}