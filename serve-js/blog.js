var mongoose =  require("mongoose");

var Schema = mongoose.Schema;

var blogSchema = Schema(
    {
        title: String,
        content: String,
        date: Date,
        visited: Number
    }
);

// 3个参数 model名，绑定的schema，db中collection名
var Blog = mongoose.model('Blog', blogSchema, "Blog");   //对象与 数据库集合"Blog"关联
module.exports = Blog;