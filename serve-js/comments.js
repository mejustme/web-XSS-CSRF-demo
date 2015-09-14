var mongoose =  require("mongoose");

var Schema = mongoose.Schema;

var commentSchema = Schema(
    {
        account: String,
        author: String,
        text: String,
        date: String,
        userImg: String
    }
);

// 3个参数 model名，绑定的schema，db中collection名
var Comments = mongoose.model('Comments', commentSchema, "Comments");   //对象与 数据库集合"Comments"关联
module.exports = Comments;