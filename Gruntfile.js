/*
module.exports = function(grunt){

    //加载插件
    require('load-grunt-tasks')(grunt);

    //配置插件
    grunt.initConfig({
        cafemocha: {
            all: {
                options:{ui: 'tdd'},
                src: 'qa/test-*.js'
            }
        },
        exec: {
            ssh :{
                cmd: 'ssh-add ~/.ssh/github'  //eval $(ssh-agent -s) 不让执行

            }
        }
    });

    // 注册集合任务
    grunt.registerTask('ssh' ,['exec:ssh'])
};*/
