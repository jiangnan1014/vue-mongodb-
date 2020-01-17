const mongoose = require('mongoose');
mongoose.connect( 'mongodb://127.0.0.1:27017/shop', {useNewUrlParser: true},(err)=>{
    if(err) throw err;
    console.log("database连接成功")
});
module.exports = mongoose;