var express = require('express');
var router = express.Router();
var User = require("../models/user")

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post('/login', function(req, res, next) {
  var param = {
    'userName':req.body.userName,
    'userPwd':req.body.userPwd
  }
  User.findOne(param, function(err, doc){ //设置查询参数
    if(err){
      res.json({
        status: '1',
        msg: err.message
      })
    }else{
      if(doc){ // 返回数据
        // 把cookie写入
        res.cookie("userId",doc.userId,{ // 设置cookie
          path:'/', // 放到主域名里面去
          maxAge:1000*60*60
        })
        res.cookie("userName",doc.userName,{ // 设置cookie
          path:'/', // 放到主域名里面去
          maxAge:1000*60*60
        })
        res.json({
          status: '0',
          msg: '',
          result:{
            'userName':doc.userName
          }
        })
      }
    }
  })
});
// 登出接口
router.get('/logout', function(req, res, next){
  res.cookie("userId", "", {
    path:'/',
    maxAge: -1
  })
  res.json({
    status: '0',
    msg: 'success',
    result:''
  })
})
// 是否已经登录
router.get('/checkOut', function(req, res, next){
  if(req.cookies.userId){ // 验证请求里面的cookie是否包含有userId
    res.json({
      status: '0',
      msg: 'success',
      result:req.cookies.userName
    })
  }else{
    res.json({
      status: '1',
      msg: '未登录',
      result:''
    })
  }
})
// 购物车列表接口
router.get('/cartList',function(req, res, next){
  let param = {
    userId:req.cookies.userId
  }
  User.findOne(param, function(err, doc){
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
      if(doc) {
        res.json({
          status:'0',
          msg:'',
          result:doc.cartList
        })
      }
    }
  })
})
module.exports = router;
