var express = require('express');  // 引入express模块
var mongoose = require('mongoose'); //引入mongodb ODM 对象文档映射
var app = express();

// set up handlebars view engine
var handlebars = require('express3-handlebars') //  映入handlebar
    .create({ defaultLayout:'main' });  //默认布局view/layout中 main, 必须在layout中
app.engine('handlebars', handlebars.engine);  //添加引擎
app.set('view engine', 'handlebars');  // 设置引擎

app.set('port', process.env.PORT || 18080); //bae 上必须是这个端口express 服务器端口

app.use(express.static(__dirname + '/public'));  // express 管理静态资源分发  __dirname 正在执行的脚本目录

// mongodb协议默认端口就是27017 同http为80
mongoose.connect("mongodb://1b78310ee3bd484bb12245c98099e686:eaf1de8fc5f44e2b953d4b2a192cf5bb@mongo.duapp.com:8908/LgLpMLllQMvVxjFozXeJ", function(err){
//mongoose.connect("mongodb://localhost:27017/bea, function(err){
    if(!err){
        console.log("成功连接数据库")
    }else{
        throw err;
    }
}); // 连接数据库bea

var fortuneCookies = [
    "苹果",
    "书包",
    "mac",
    "100元",
    "滴滴打车券20元"
];

app.get('/', function(req, res) {
    res.charset =  'utf-8'; //默认编码 可html代替 <meta http-equiv="content-type" content="text/html;charset=gb2312">
    res.render('home'); // render表示传送视图home.handlebars , 原生写法 res.end('读取文件返回的数据data')
});

app.get('/prize', function(req,res){
    var randomFortune =
        fortuneCookies[Math.floor(Math.random() * fortuneCookies.length)];
    res.render('prize', { fortune: randomFortune });
});

app.get('/blog', function(req,res){
    var Blog = require('./js/blog');
    var blogList = [];
    Blog.find(function(err, blogs){
        var  tempArr =[];
        tempArr = blogs.map(function(blog){
             // 不知道为什么blog.date = blog.date.toString().match(/\d+:\d+:\d+/)[0];无效
             var  tempBlog = {}; //必须放里面，每次创造一个新的，否则数组中都是指向同一个的引用
             tempBlog.title = blog.title;
             tempBlog.content = blog.content;
             tempBlog.date =  blog.date.toString().match(/\d+:\d+:\d+/)[0];
             tempBlog.visited = blog.visited;
             tempArr.push(tempBlog);
             //match非全局匹配  返回的是数组[结果，正则表达式子表达式，index,原值]
             //match全局匹/g ,返回也是数组，只有多个全匹配结果
             //return blog; 必须返回该值才改变
             return tempBlog;
         });
         //console.log(tempArr)
         res.render('blog', { blogs: tempArr }); //必须放回调里！异步
    });
    //res.render('blog', { blogs: blogList });
});

app.get('/505', function(req,res){
    res.render('nothing');  //故意产生内部错误，返回505页面
});

// 404 catch-all handler (middleware)
app.use(function(req, res, next){
    res.status(404);  // 必须要自己写  等价原生 res.writeHead(200, {'content-Type': 'text/html'})
    res.render('404');
});

// 500 error handler (middleware)
app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), function(){
    console.log( 'Express started on http://localhost:' +
    app.get('port') + '; press Ctrl-C to terminate.' );
});
