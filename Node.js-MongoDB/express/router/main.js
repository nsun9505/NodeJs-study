module.exports = function(app, fs){
    // view로 데이터 넘기기
    // 여기서는 EJS 템플릿 엔진 사용
    app.get('/', function(req, res){
        var sess = req.session;
        res.render('index', {
            title: "My Homepage",
            length: 5,
            name: sess.name,
            username: sess.username 
        })
    });

    app.get('/list', function(req, res){
        fs.readFile(__dirname + "/../data/" + "user.json", 'utf-8', function(err, data){
            console.log(data);
            res.end(data);
        })
    })

    app.get('/getUser/:username', function(req, res){
        fs.readFile(__dirname+"/../data/user.json", 'utf-8', function(err, data){
            var users = JSON.parse(data);
            res.json(users[req.params.username]);
        })
    })

    app.post('/addUser/:username', function(req, res){
        var result = {};
        var username = req.params.username;

        //CHECK REQ VALIDAITY
        if(!req.body["password"] || !req.body["name"]){
            result["success"] = 0;
            result["error"] = "invalid request";
            res.json(result);
            return;
        }

        fs.readFile(__dirname+"/../data/user.json", 'utf-8', function(err, data){
            var users = JSON.parse(data);
            if(users[username]){
                // DUPLICATION FOUND
                result["success"] = 0;
                result["error"] = "duplicate";
                res.json(result);
                return;
            }

            // ADD TO DATA
            users[username] = req.body;

            // SAVE DATA
            fs.writeFile(__dirname+"/../data/user.json",
                        JSON.stringify(users, null, '\t'), 'utf-8', function(err, data){
                            result = {"success": 1};
                            res.json(result);
            })
        });
    });

    app.put('/updateUser/:username', function(req, res){

        var result = {  };
        var username = req.params.username;

        // CHECK REQ VALIDITY
        if(!req.body["password"] || !req.body["name"]){
            result["success"] = 0;
            result["error"] = "invalid request";
            res.json(result);
            return;
        }

        // LOAD DATA
        fs.readFile( __dirname + "/../data/user.json", 'utf8',  function(err, data){
            var users = JSON.parse(data);
            // ADD/MODIFY DATA
            users[username] = req.body;

            // SAVE DATA
            fs.writeFile(__dirname + "/../data/user.json",
                         JSON.stringify(users, null, '\t'), "utf8", function(err, data){
                result = {"success": 1};
                res.json(result);
            })
        })
    });

    app.delete('/deleteUser/:username', function(req, res){
        var result = {};

        fs.readFile(__dirname+"/../data/user.json", "utf8", function(err, data){
            var users = JSON.parse(data);

            // IF NOT FOUND
            if(!users[req.params.username]){
                result["success"] = 0;
                result["error"] = "not found";
                res.json(result);
                return;
            }
            
            delete users[req.params.username];
            fs.writeFile(__dirname+"/../data/user.json",
                        JSON.stringify(users, null, '\t'), "utf8", function(err, data){
                            result["success"] = 1;
                            res.json(result);
                            return;
            });
        });
    });

    app.get('/login/:username/:password', function(req, res){
        var sess;
        sess = req.session;

        fs.readFile(__dirname+"/../data/user.json", "utf8", function(err, data){
            var users = JSON.parse(data);
            var username = req.params.username;
            var password = req.params.password;
            var result = {};
            if(!users[username]){
                result["success"] = 0;
                result["error"] = "not found";
                res.json(result);
                return;
            }

            if(users[username]["password"] == password){
                result["success"] = 1;
                sess.username = username;
                sess.name = users[username]["name"];
                res.json(result);
            } else {
                result["success"] = 0;
                result["error"] = "incorrect";
                res.json(result);
            }
        });
    });

    app.get('/logout', function(req, res){
        sess = req.session;
        if(sess.username){
            req.session.destroy(function(err){
                if(err){
                    console.log(err);
                } else {
                    res.redirect('/');
                }
            })
        } else {
            res.redirect('/');
        }
    });
}

/*  
    템플릿 엔진이란 템플릿을 읽어 엔진의 문법과 설정에 따라서 파일을 HTML 형식으로 변환시키는 모듈
    Express에서 사용하는 인기있는 Jade 템플릿 엔진은 기존의 HTML에 비해 작성법이 다름.
    EJS는 똑같은 HTML에서 <% %>를 사용하여 서버의 데이터를 사용하거나 코드를 실행할 수 있음.
    1. <% 자바스크립트 코드%>
    2. <% 출력 할 자바스크립트 객체 %>
*/  