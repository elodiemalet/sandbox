var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');

var app = express();

app.use(cookieParser())
    .use(session({secret: "todosecret",
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 60000 }}))
    .use(bodyParser.urlencoded({ extended: false }))
    .use(function (req, res, next) {

        if(typeof(req.session.todo) == 'undefined') {
            req.session.todo = new Array();
            console.log(1, req.session.todo);
        }
        console.log(2, typeof(req.session.todo));
        next();
    })
    .get('/', function (req, res) {
        res.setHeader('Content-Type', 'text/html');
        res.render('index.ejs', {todo: req.session.todo});
    })
    .post('/add', function(req, res){
        if(req.body.todo != '') {
            req.session.todo.push(req.body.todo);
        }
        res.redirect('/');
    })
    .get('/remove/:id', function (req, res) {
        if(req.params.id != '') {
            req.session.todo.splice(req.params.id, 1);
        }
        res.redirect('/');

    });

app.use(function (req, res, next) {
    res.setHeader('Content-Type', 'text/plain');
    res.status('404', 'Page introuvable !');
})

app.listen(8080);