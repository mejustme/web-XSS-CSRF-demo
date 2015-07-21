var express = require('express');  // 引入express模块
var mongoose = require('mongoose'); //引入mongodb ODM 对象文档映射
var app = express();

var handlebars = require('express3-handlebars') //  映入handlebar
    .create({
        defaultLayout:'indexLayout',
        helpers: {                    //helpers, 是section辅助函数
            section: function(name, options){
                if(!this._sections) this._sections = {};
                this._sections[name] = options.fn(this);
                return null;
            }
        }
    });

app.engine('handlebars', handlebars.engine);  //添加引擎
app.set('view engine', 'handlebars');  // 设置引擎


app.set('port', process.env.PORT || 18080); //bae 上必须是这个端口express 服务器端口,但请求仍然是80
//app.set('port', process.env.PORT || 80); //本地

mongoose.connect("mongodb://1b78310ee3bd484bb12245c98099e686:eaf1de8fc5f44e2b953d4b2a192cf5bb@mongo.duapp.com:8908/LgLpMLllQMvVxjFozXeJ", function(err){
//mongoose.connect("mongodb://localhost:27017/bae", function(err){
    if(!err){
        console.log("成功连接数据库");
    }else{
        console.log("连接数据库失败");
        throw err;
    }
}); // 连接数据库bea

app.use(express.static(__dirname + '/public'));  // express 管理静态资源分发  __dirname 正在执行的脚本目录
var cookieParser = require('cookie-parser');
var mySecret = "cookieSecret12345";
app.use(cookieParser(mySecret));  // 私钥,签名 必须是要引入cookie中间件
app.use(require('body-parser')()); // 解析post参数中间件
app.use(require('express-session')()); //session中间件

app.get('/', function(req,res,next){

        res.render('login', { layout: 'indexLayout',title: '登录'});  //更换布局文件

});

app.post('/login', function(req,res){
    var inputAccount = req.body.account;
    var inputPassword = req.body.password;

    res.cookie('account',inputAccount,{signed: true, httpOnly: true}); //签名+httpOnly
    res.cookie('password',inputPassword,{signed: true, httpOnly: true});

    var Users = require('./serve-js/users');
    Users.find({account: inputAccount}, function(err, users){
        if(users.length == 1){
            if(users[0].password === inputPassword){
                res.json({
                    action: "login",
                    state: "loginSuccess",
                    href : "//mejustme.duapp.com/demo"
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

app.post('/signup', function(req,res){

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

app.use(function(req,res,next){   //以下都进行身份校验
    var inputSignedAccount = req.signedCookies.account;
    var inputSignedPassword = req.signedCookies.password;
    var Users = require('./serve-js/users');
    if(inputSignedAccount != undefined && inputSignedPassword != undefined ){
        var inputAccount = cookieParser.signedCookie(inputSignedAccount,mySecret);
        var inputPassword = cookieParser.signedCookie(inputSignedPassword,mySecret);
        Users.find({account: inputAccount},function(err,users){
            if(users.length == 1 && users[0].password == inputPassword){
                res.locals.account = inputAccount;  // 当前请求中保存账号
                req.session.Account  = inputAccount; //session保存当前账号密码
                req.session.Password  = inputPassword;
                next();  //要next(),否则终止下面操作
            }else{
                res.redirect(303,'/');
            }
        })
    }else{
        res.redirect(303,'/');
    }
});

app.use('/demo', function(req,res){
    res.render('demo', { layout: 'indexLayout'});
});

app.use('/comment', function(req,res){
    var exampleCookies= ['Account','Password','signedAccount','signedPassword'];
    exampleCookies.forEach(function(name){
        res.clearCookie(name)
    });
    if(req.query.cookieSafe === "false"){
        res.cookie('Account',req.session.Account); //给予验证，浏览器可查看修改
        res.cookie('Password',req.session.Password);
        res.cookie('signedAccount',req.session.Account);
        res.cookie('signedPassword',req.session.Password);
    }else if(req.query.cookieSafe === "true"){
        res.cookie('Account', req.session.Account, {signed: true, httpOnly: true}); //给予验证，浏览器可查看修改
        res.cookie('Password', req.session.Password, {signed: true, httpOnly: true});
        res.cookie('signedAccount', req.session.Account, {signed: true});
        res.cookie('signedPassword', req.session.Password, {signed: true});
    }
    var getRandomStr = require('./serve-js/getRandomStr.js');
    var attack = (req.query.csrf === "true" ? true : false) ;
    var config = (req.query.config === "true" ? true : false) ;

    if(req.query.prueComment != 'true'){
        if(req.query.denyCsrf === "false"){
            res.render('comment', { layout: 'indexLayout', title: '评论', token: undefined ,tokenjs:"example-notoken.js", attack: attack});

        }else{  /*denyCsrf=true 或者 无 都校验token*/
            req.session.token  = getRandomStr(10);  //产生随机10位token
            res.render('comment', { layout: 'indexLayout', title: '评论', token: req.session.token ,tokenjs:"example.js", attack: attack});
        }
    }else{
        res.render('purecomment', { layout: 'indexLayout', title: '原生评论', config: config});
    }



});

app.get('/getComments', function(req,res){   /* ajax获取 评论数据*/

    var Comments = require('./serve-js/comments.js');
    var inputAccount = res.locals.account;
    Comments.find({account: inputAccount}, function(err, comments){
        res.setHeader('Cache-Control', 'no-cache');
        res.json(comments);
    });
});

app.post('/addComment', function(req,res){   //ajax(post)或者post跨域 动态提交 评论数据

    var exampleCookies= ['Account','Password','signedAccount','signedPassword'];
    exampleCookies.forEach(function(name){
        res.clearCookie(name)
    });
    if(req.query.cookieSafe === "false"){
        res.cookie('Account',req.session.Account); //给予验证，浏览器可查看修改
        res.cookie('Password',req.session.Password);
        res.cookie('signedAccount',req.session.Account);
        res.cookie('signedPassword',req.session.Password);
    }else if(req.query.cookieSafe === "true"){
        res.cookie('Account', req.session.Account, {signed: true, httpOnly: true}); //给予验证，浏览器可查看修改
        res.cookie('Password', req.session.Password, {signed: true, httpOnly: true});
        res.cookie('signedAccount', req.session.Account, {signed: true});
        res.cookie('signedPassword', req.session.Password, {signed: true});
    }

    var inputAuthor = req.body.author;
    var inputText = req.body.text;
    var inputDate = req.body.date;
    var inputUserImg = req.body.userImg;
    var inputToken = req.body.token;
    var inputAccount = res.locals.account;

    if(inputDate == undefined){
        inputDate ="2015/7/22";
    }

    if(req.query.serverClear == "true"){
         clearInput = require('./serve-js/clearInput');
         inputAuthor = clearInput(inputAuthor);
         inputText = clearInput(inputText);
         inputDate = clearInput(inputDate);
         inputUserImg = clearInput(inputUserImg);
    }

    if(req.session.token === inputToken || req.query.denyCsrf == "false"){   //默认开启token校验
        var Comments = require('./serve-js/comments');
        var newComment = new Comments();
        newComment.account = inputAccount;
        newComment.author = inputAuthor;
        newComment.text = inputText;
        newComment.date = inputDate;
        newComment.userImg = inputUserImg;

        newComment.save(function(err){
            if(err){
                res.json({
                    action: "addComment",
                    state: "addCommentError",
                    msg: "添加评论失败"
                })
            }else{
                var Comments = require('./serve-js/comments.js');
                Comments.find({account: inputAccount}, function(err, comments){
                    res.json({
                        action: "addComment",
                        state: "addCommentSuccess",
                        comments: comments
                    })
                });
            }
        })
    }else{
        res.json({
            action: "addComment",
            state: "addCommentError",
            msg: "添加评论失败"
        })
    }

});

app.use(function(req, res, next){
    res.status(404);  // 必须要自己写
    res.render('404');
});

app.use(function(err, req, res, next){
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), function(){
    console.log( 'Express started on http://localhost:' +
    app.get('port') + '; press Ctrl-C to terminate.' );
});
