var mongoose = require('mongoose')
var Schema = mongoose.Schema

var produtSchema = new Schema({
    "productId": { type: String },
    "productName": String,
    "salePrice": String,
    "productImage":String,
    "productNum": String,
    "checked": String
})
// 这里注意在数据库建立集合的时候取名为goods 是复数,Good到时候就会自动关联到goods这个集合
//如果建的集合是good，那么下面这句话就要这样写module.exports = mongoose.model('Good', produtSchema ,'good')
module.exports = mongoose.model('Good', produtSchema)