$('.form').find('input, textarea').on('keyup blur focus', function (e) {

    var $this = $(this),
        label = $this.prev('label');

    if (e.type === 'keyup') {
        if ($this.val() === '') {
            label.removeClass('active highlight');
        } else {
            label.addClass('active highlight');
        }
    } else if (e.type === 'blur') {
        if( $this.val() === '' ) {
            label.removeClass('active highlight');
        } else {
            label.removeClass('highlight');
        }
    } else if (e.type === 'focus') {

        if( $this.val() === '' ) {
            label.removeClass('highlight');
        }
        else if( $this.val() !== '' ) {
            label.addClass('highlight');
        }
    }

});

$('.tab a').on('click', function (e) {

    e.preventDefault();

    $(this).parent().addClass('active');
    $(this).parent().siblings().removeClass('active');

    target = $(this).attr('href');

    $('.tab-content > div').not(target).hide();

    $(target).fadeIn(600);

});

var canlogin = true;

$('.signup-button, .login-button').on('click',function(){
   if(canlogin){
       var action = $(this).hasClass('login-button') ? "login" : "signup";
       $.ajax({
           type: "POST",
           url: "http://mejustme.duapp.com/" + action,
           dataType: 'json',
           data: $(this).parent('form').serialize(),
           xhrFields: {
               withCredentials: true  // 让ajax 跨域带上cookie  默认不带
           },
           success: function(msg){
               if(msg.action == 'login'){
                  if(msg.state == 'loginSuccess'){
                       location.href = msg.href;
                   }else{
                       inform('login',msg.msg);
                   }
               }else if(msg.action == 'signup'){
                   inform('signup',msg.msg);
               }

           },
           error: function(){
               alert(msg)
           }
       });

   }
    return false;
});

function inform(action, content){
    var $h1 = $("#" + action).find('h1');
    var textOld = $h1.text();
    canlogin = false ; //防止 在更改文字状态重复提交
    if(action == 'login'){
        $h1.text(content).css('color','#f5af08').fadeOut(2500,function(){

            $h1.text(textOld).css('color',"#fff").fadeIn(500);
            canlogin = true ;
        });
    }else{
        $h1.text(content).css('color','#f5af08');
        canlogin = true ;
    }

}
