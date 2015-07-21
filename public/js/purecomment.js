$(function(){
    var defend = false;
    var cookieSafe = true;
    if(window.location.search.indexOf('defend') != -1){
        defend = true;
    }
    $.ajax({
        url: 'http://mejustme.duapp.com/getComments',
        type: 'get',
        dataType: 'json',
        success: function(data){
            // data = [{"userImg":"//g01.alibaba-inc.com/tfscom/TB1IFxiIpXXXXaOXFXXXXXXXXXX.tfsprivate_80x80","date":"2015/7/20","text":"你已受到CSRF攻击,时间:1437481217968","account":"hacker","_id":"55ae390251cd338b72758df7","__v":0},{"userImg":"//g01.alibaba-inc.com/tfscom/TB1IFxiIpXXXXaOXFXXXXXXXXXX.tfsprivate_80x80","date":"2015/7/20","text":"你已受到CSRF攻击,时间:1437483156859\<script\>alert()\<\/script\>","account":"hacker","_id":"55ae409551cd338b72758df8","__v":0}]
            if(data){

                $(data).each(function(i, d){

                    var html = '<div class="comment">' +
                        '<div class="author">' +
                        '<img class="author_icon" src="' + parse(d.userImg, defend) + '"/>' +
                        '<span class="author_name">'+ parse(d.author, defend) +'</span>' +
                        '<span class="time">'+ parse(d.date, defend) +'</span>' +
                        '</div>' +
                        '<div class="comment_text">' +parse(d.text, defend) + '</div>' +
                        '</div>';

                    $('.CommentList').append(html);

                });
            }
        }
    });
});

$('.btn').click(function(){
    var form = $('form');
    var cmt = {
        author: $('.user').val(),
        text: $('.text').val(),
        userImg: $('.userImg').val()
    }
    var serverDefend = $('#serverClear')[0].checked; //服务器数据是否转义
    defend = $('#outDefend')[0].checked;  //前端输出是否转义
    cookieSafe = $('#cookieSafe')[0].checked; //cookie是否安全保存
    $.ajax({
        url: 'http://mejustme.duapp.com/addComment?denyCsrf=false&' + (serverDefend?'serverClear=true':'serverClear=false') + (cookieSafe?'&cookieSafe=true':'&cookieSafe=false'),
        type: 'post',
        data: cmt,
        dataType: 'json',
        success: function(data){
            if(data.state === "addCommentSuccess"){
                d = data.comments.pop();
                var html = '<div class="comment">' +
                    '<div class="author">' +
                    '<img class="author_icon" src="' + parse(d.userImg, defend) + '"/>' +
                    '<span class="author_name">'+ parse(d.author, defend) +'</span>' +
                    '<span class="time">'+ parse(d.date, defend) +'</span>' +
                    '</div>' +
                    '<div class="comment_text">' +parse(d.text, defend) + '</div>' +
                    '</div>';

                $('.CommentList').append(html);
            }else{
                alert(data.msg);
            }
        }

    });
});
function parse(text, denfend){
    if(denfend){
        text = htmlEscape(text);
    }
    return text;
}

/*替换字符*/
function htmlEscape(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}
