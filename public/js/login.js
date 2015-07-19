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


$('.signup-button, .login-button').on('click',function(){
    console.log($(this).parent('form').serialize());
    console.log($(this).attr('class'));
    $.ajax({
        type: "POST",
        url: "http://mejustme.duapp.com:18080/login",
        dataType: 'json',
        data: $(this).parent('form').serialize(),
        xhrFields: {
            withCredentials: true  // 让ajax 跨域带上cookie  默认不带
        },
        success: function(msg){
           if(msg.state == 'pwdError'){
               alert(msg.msg + "认真输入密码");
           }else if(msg.state == 'accountError'){
               alert(msg.msg + "认真输入账号");
           }else if(msg.state == 'loginSuccess'){
               console.log(msg);
               location.href = msg.href;
           }
        },
        error: function(){
            alert(msg)
        }

    })
    return false;
});
