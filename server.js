var express = require('express');  // 引入express模块
var mongoose = require('mongoose'); //引入mongodb ODM 对象文档映射
var app = express();

var handlebars = require('express3-handlebars') //  映入handlebar
    .create({
        defaultLayout:'indexLayout',
        helpers: {                    //helpers,有s, 是section辅助函数
            section: function(name, options){
                if(!this._sections) this._sections = {};
                this._sections[name] = options.fn(this);
                return null;
            }
        }
    });

app.engine('handlebars', handlebars.engine);  //添加引擎
app.set('view engine', 'handlebars');  // 设置引擎

app.set('port', process.env.PORT || 18080); //bae 上必须是这个端口express 服务器端口
// mongodb协议默认端口就是27017 同http为80
//mongoose.connect("mongodb://1b78310ee3bd484bb12245c98099e686:eaf1de8fc5f44e2b953d4b2a192cf5bb@mongo.duapp.com:8908/LgLpMLllQMvVxjFozXeJ", function(err){
mongoose.connect("mongodb://localhost:27017/bae", function(err){
    if(!err){
        console.log("成功连接数据库")
    }else{
        throw err;
    }
}); // 连接数据库bea

app.use(express.static(__dirname + '/public'));  // express 管理静态资源分发  __dirname 正在执行的脚本目录
var cookieParser = require('cookie-parser');
var mySecret = "cookieSecret12345"
app.use(cookieParser(mySecret));  // 私钥,签名 必须是要引入cookie中间件

app.use(require('body-parser')());

app.get('/', function(req,res){
    /*var login = require('./js/login');*/
    res.render('login', { layout: 'indexLayout',title: '登录'});  //更换布局文件
});

/*app.get('/blog', function(req,res){
    var Blog = require('./serve-js/blog');
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
});*/

app.use('/login', function(req,res){

    res.set('Access-Control-Allow-Origin', req.headers.origin);   ////允许当前页面，那返回的信息
    res.set('Access-Control-Allow-Credentials', true);  //允许当前页面，拿返回的cookie (这时 不可用用* 匹配 Allow-Origin)
    res.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    var inputAccount = req.body.account;
    var inputPassword = req.body.password;

    var Users = require('./serve-js/users');
    Users.find({account: inputAccount}, function(err, users){
        if(users.length == 1){
            if(users[0].password === inputPassword){
                res.cookie('account',inputAccount,{signed: true, httpOnly: true});
                res.cookie('password',inputPassword,{signed: true, httpOnly: true});
                res.json({
                    action: "login",
                    state: "loginSuccess",
                    href : "http://mejustme.duapp.com:18080/comment"
                })
            }else{
                res.json({
                    action: "login",
                    state: "pwdError",
                    msg : "密码错误"
                })
            }
        }else{
            res.json({
                action: "login",
                state: "accountError",
                msg : "账号不存在"
            })
        }
    });

});

app.use('/signup', function(req,res){
    res.set('Access-Control-Allow-Origin', req.headers.origin);   ////允许当前页面，那返回的信息
    res.set('Access-Control-Allow-Credentials', true);  //允许当前页面，拿返回的cookie (这时 不可用用* 匹配 Allow-Origin)
    res.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    var inputAccount = req.body.account;
    var inputPassword = req.body.password;
    var Users = require('./serve-js/users');
    Users.find({account: inputAccount}, function(err, users){
        if(users.length == 1){
            res.json({
                action: "signup",
                state: "accountError",
                msg: "账号已存在"
            })

        }else{
            var newUser = new Users();
            newUser.account = inputAccount;
            newUser.password = inputPassword;
            newUser.save(function(err){
                if(err){
                    res.json({
                        action: "signup",
                        state: "signupError",
                        msg: "注册失败"
                    })
                }
                res.json({
                    action: "signup",
                    state: "signupSuccess",
                    msg: "注册成功,请登录"
                })
            })

        }
    });
});

app.use('/comment', function(req,res){
    var inputSignedAccount = req.signedCookies.account;
    var inputSignedPassword = req.signedCookies.password;
    var inputAccount = cookieParser.signedCookie(inputSignedAccount,mySecret);
    var inputPassword = cookieParser.signedCookie(inputSignedPassword,mySecret);
    console.log(inputAccount);
    console.log(inputPassword);
    var Users = require('./serve-js/users');
    Users.find({account: inputAccount},function(err,users){
        if(users.length == 1 && users[0].password == inputPassword){
            res.render('comment', { layout: 'indexLayout' ,title: '评论'});
        }else{
            res.redirect(303,'/');
        }
    })

});


app.use('/ajax', function(req,res){
    console.log('来着跨域请求',req.host + req.url);
    /* for(var key in req.cookies){
     console.log(key + req.cookies[key]);
     }*/
    /*  res.cookie('lulu2',10084108,{httpOnly:true});//httpOnly 服务器可读写，浏览器不可见
     res.cookie('cqh1',888888,{signed:true});*/  // sigined签名
    res.type('text/plain');
    res.set('Access-Control-Allow-Origin', req.headers.origin);   ////允许当前页面，那返回的信息
    res.set('Access-Control-Allow-Credentials', true);  //允许当前页面，拿返回的cookie (这时 不可用用* 匹配 Allow-Origin)
    res.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');

    console.log()
    var account = req.body.account;
    var password = req.body.password;
    // res.send("you account:" + account +'\n' + "you password:" + password);
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
