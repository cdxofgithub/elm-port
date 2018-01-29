// var express = require('express');
import express from 'express'
var path = require('path')
import db from './mongodb/db.js';
import config from 'config-lite';
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session') ;
var connectMongo = require('connect-mongo');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
import routes from './routes/index'

var app = express();


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'cdx',
    name: 'cdx',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 30 * 60 * 100,
        secure: false
    }
}))

app.all('*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", 'http://localhost:8080');
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Credentials", true); //可以带cookies
    res.header("X-Powered-By", '3.2.1')
    res.header('Content-Type', 'application/json; charset=utf-8');
    if (req.method == 'OPTIONS') {
        res.send(200);
    } else {
        next();
    }
});

app.use(function (req, res, next) {
    req.session._garbage = Date();
    req.session.touch();
    next();
});

routes(app)

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
