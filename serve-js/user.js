var mongoose =  require("mongoose");

var Schema = mongoose.Schema;

var UserSchema = Schema(
    {
        account: String,
        password: String
    }
);

// 3个参数 model名，绑定的schema，db中collection名
var User = mongoose.model('User', UserSchema, "User");   //对象与 数据库集合"Blog"关联
module.exports = User;