var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs')
var index = require('./routes/index');
var users = require('./routes/users');
var goods = require('./routes/goods');

var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// var ejs = require('ejs')
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

var ejs = require('ejs')
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', ejs.__express)
app.set('view engine', '.html');




// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser()); // 可以处理cookie的一个中间件
app.use(express.static(path.join(__dirname, 'public')));

// 加入全局登录拦截的功能 如果没有登录接口将会被拦截下来
app.use(function (req, res, next) {
  if (req.cookies.userId) { //如果请求里面包含了cookie 那么直接next
    next()
  } else {
    // 登录接口 登出接口 商品分页（里面有其他参数） 是可以通过的
    if (req.originalUrl == '/users/login' 
    || req.originalUrl == '/users/logout' 
    || req.originalUrl.indexOf('/goods/list') > -1) {
      console.log('没有拦截');
      
      next()
    } else {
      console.log('拦截咯:');
      
      res.json({
        status: '10001',
        msg: '当前未登录',
        result: ''
      })
    }
  }
})


app.use('/', index);
app.use('/users', users);
app.use('/goods', goods);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
