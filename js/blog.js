var mongoose =  require("mongoose");

var Schema = mongoose.Schema;

var blogSchema = {
    title: String,
    content: String,
    date: Date,
    visited: Number
};

var Blog = mongoose.model('Blog', 'blogSchema');
module.exports = Blog;