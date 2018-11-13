var express = require('express');
var router = express.Router();
var mongoose = require('mongoose')
var Goods = require('../models/goods')

// 连接数据库
mongoose.connect('mongodb://127.0.0.1:27017/dumall')
mongoose.connection.on("connected", function () {
    console.log("MongoDB connected success.")
})
mongoose.connection.on("error", function () {
    console.log("MongoDB connected fail.")
})
mongoose.connection.on("disconnected", function () {
    console.log("MongoDB connected disconnected.")
})
// 商品列表展示
router.get('/list', function (req, res, next) {
    //res.send('hello, goods list ....') 测试路由
    // 这里获取参数使用param，这个是express框架封装的方法，和nodeJs原生的方法不同
    let page = parseInt(req.param("page"))
    let pageSize = parseInt(req.param("pageSize"))
    let sort = parseInt(req.param("sort"))

    let priceLevel = req.param("priceLevel") //获取价格区间的参数
    var priceGt = '', priceLte = '';
    let params = {}
    // 跳过多少条数据
    let skip = (page - 1) * pageSize
    // 价格查询
    if(priceLevel !="all"){
        switch (priceLevel) { // 前后端约定好
            case '0' : priceGt = 0;priceLte = 100;break;
            case '1' : priceGt = 100;priceLte = 500;break;
            case '2' : priceGt = 500;priceLte = 1000;break;
            case '3' : priceGt = 1000;priceLte =2000;break;
        }
        params = { // 设置查询条件
            salePrice:{
                $gt: priceGt,
                $lte:priceLte
            }
        }
    }
    // 找到数据，跳过前面的多少条，然后再显示pageSize这么多条
    let goodsModel = Goods.find(params).skip(skip).limit(pageSize)
    goodsModel.sort({ 'salePrice': sort })
    goodsModel.exec(function (err, doc) {
        if (err) {
            res.json({
                status: '1',
                msg: err.message
            });
        } else {
            // 设置返回值
            res.json({
                status: '0',
                msg: '',
                result: {
                    count: doc.length,
                    list: doc
                }
            })
        }
    })
})
// 加入到购物车
router.post("/addCart", function(req, res, next) {
    var userId = "100000077", productId = req.body.productId;
    var User = require("../models/user")
    User.findOne({'userId':userId}, function (err, userDoc){ // 判断是否有这个用户
        if(err){
            res.json({
                status: '1',
                msg:err.message,
                result: ''
            })
        }else{
            if(userDoc){ //用户存在
                let goodsItem = '';
                userDoc.cartList.forEach(function(item){
                    if(item.productId == productId){
                        goodsItem = item;
                        item.productNum ++;
                    }
                })
                if(goodsItem){ //如果购物车列表里面商品已经存在了
                    userDoc.save(function (err2, doc2) {
                        if(err2){
                            res.json({
                                status: '1',
                                msg:err2.message
                            })
                        }else{
                            res.json({
                                status: '0',
                                msg:'',
                                result: 'success'
                            })
                        }
                    })
                }else{ // 如果这个商品还没有加过购物车
                    // 通过商品ID找到商品信息
                    Goods.findOne({'productId':productId}, function(err1, doc){ //按条件找到商品
                    if(err1){
                        res.json({
                            status: '1',
                            msg:err1.message
                        })
                    }else{
                        if(doc){
                            // 这样是无法把这两个属性保存起来的，解决办法：https://www.cnblogs.com/bfwbfw/p/7899797.html
                            // doc.productNum = 1;
                            // doc.checked = 1;
                            // doc.productImage = doc.productImage;
                            let newobj = {//新创建一个对象，实现转换mongoose不能直接增加属性的坑
                                    "productId": doc.productId,
                                    "productName": doc.producName,
                                    "salePrice": doc.salePrice,
                                    "productImage": doc.productImage,
                                    "productNum": 1,
                                    "checked": 1,
                            }
                            // doc.productNum = "1"
                            // doc.checked = "1"
                            userDoc.cartList.push(newobj)
                            userDoc.save(function (err2, doc3) {
                                if(err2){
                                    res.json({
                                        status: '1',
                                        msg:err2.message
                                    })
                                }else{
                                    res.json({
                                        status: '0',
                                        msg:'',
                                        result: 'success'
                                    })
                                }
                            })
                        }
                    }
                })
                }
            }
        }
    })
})
module.exports = router