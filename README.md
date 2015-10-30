##mongodb配置启动
@(my_mongoDB)[mongoDB安装配置]

###安装mongodb
[官网下载](https://www.mongodb.org/?_ga=1.214696983.1685535600.1436681453)

###配置mongodb

默认mongodb提供的操作命令是`没有加入PATH中`的，需要手动添加
**`区别`**
- **mongod** 命令是数据库启动相关的
- **mongo** 命令是操作数据库的客户端 [详见mongodb cmd使用](#)

###启动数据库
####1、根据默认配置，开启 `不推荐`
`命令`
```
> mongod
/*
默认读取/data/db 数据库文件 (windows中C:/data/db **默认没有建立**)
故，提示错误
exception in initAndListen: 29 Data directory C:\data\db\ not
found., terminating,
需要手动建立该目录
*/
```
####2、指定定配置文件 ，开启 `推荐`
官方没有提供可见的配置文件，要自己手动添加
`命令`
```
> mongod --config E:\MongoDB\etc\mongodb.conf
// 运行后 该命令行不能再输入，日志已经输入到日志文件，
// ctrl + c 关闭服务器
```
**配置文件参考** [官网文档](http://docs.mongodb.org/manual/reference/configuration-options/)
```
#严格更加YAML语法来配置  配置文档http://docs.mongodb.org/manual/reference/configuration-options/
#日志输出文件路径
systemLog:
destination: file
path: E:\MongoDB\data\log\mongod.log  //不能用引号！
logAppend: true

#数据库
storage:
dbPath: E:\MongoDB\data\db
```
#### 3、命令中修改默认配置，开启 `也推荐`
`命令`
```
> mongod --dbpath "E:\MongoDB\data\db"
```

#### 4、配置成window服务 `也推荐`
服务的好处：开机自动启动否可定义
涉及cmd命令  sc
**创建服务**
`命令`
```
//方法一 根据指定配置 install
mongod --config "E:\MongoDB\etc\mongod.cfg" --install

//方法二  更加原生，用sc
sc create MongoDB binPath= "E:\MongoDB\Server3.0\bin\mongod.exe --service --config=E:\MongoDB\etc\mongod.cfg"

//原生命令行启动与关闭服务  ，也可手动
net start MongoDB
net stop MongoDB
```
**删除window指定服务**
`命令`
```
//方法一
mongod --remove
//方法二 原生
sc delete MongoDB  // 服务名自己先查看下，任务管理器》服务

```


##mongodb 原生使用
@(my_mongoDB)[mongoDB原生使用]
> 官方提供了一个命令行工具 mongo `不是mongod`
> mongo是一个`javascript shell`, 可以运行Js
> mongo客户端自动连接到本机服务器的test数据库

#### 存储于获取
> mongoDB 中存的数据库都是以标准json格式 `key/value 都要加双引号，`除原始值`，返回也是json
> mongo 用 js对象存入， `js对象 非严格json`，属性key可也不加双引号
####创建与切换数据库
- db 全局变量，指向当前的数据库
```
> db
test  //当前指向的数据库
> use bae
switch to db bae  //创建了一个数据库bae
```
#### insert
```
// 在启动了mongo 命令行中键入  ,title、hello写错了，将错就错了
> post = {"titel" : "helo world",
... "content" : "我的第一篇博文，hello mongodb",
... "data" : new Date()}
{
"titel" : "helo world",
"content" : "我的第一篇博文，hello mongodb",
"data" : ISODate("2015-07-12T09:09:10.154Z")
}

> db.blog.insert(post)
WriteResult({ "nInserted" : 1 }) //成功插入
```
####find
```
> db.blog.find()
// 输出我刚插入的信息
{ "_id" : ObjectId("55a22f1a139c555a20e7d38a"), "titel" : "helo world", "content" : "我的第一篇博文，hello mongodb", "data" : ISODate("2015-07-12T09:09:10.154Z") }
```
####update
> 至少接受连个参数，一个匹配条件对象，一个更新后的对象
```
> post.commet = [] ;  // mongo 环境中一种记录着这个变量
> db.blog.update({titel: "helo world"}, post)
// WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 })
// 会显示 匹配的条数，修改的条数
```
####remove
> 当没有参数时，删除集合中所有
> 当有匹配条件对象，删除那条记录
```
> db.blog.remove({titel : "helo world"})
// WriteResult({ "nRemoved" : 1 })
```