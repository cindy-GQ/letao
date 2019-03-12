$(function () {

    register()
    
    /* 点击注册,获取所有用户信息,发请求,获取接口数据(本来是失去焦点时 做这些判断)

       1.获取所有用户信息时.首先前后去空格处理
       2.对手机号输入,用户名输入进行正则判断,
       3.进行密码和确认密码输入比对是否一致
       4.点击获取验证码,,发请求,后台获取数据
       5.获取以上所有信息,当做参数传给后台,后台返回注册成功,则返回登录页面并跳转到个人中心*/
       //定义一个变量,存储验证码(作用在手机或别处收到的验证码与,当前你输入的是否一致,本案例用不到)
    //    var vCode="";
    //给注册按钮注册点击事件
   function register() {
    $('.btn-register').on('tap', function () {
        // 假设验证是通过了的
        var isChecked = true;
        //以下代码判断去完空格后是否为空
        // 获取索input标签
        var inputs = $('.mui-input-row input') 
        //遍历
        inputs.each(function(){
            if (this.value.trim()=='') {
                mui.toast(this.placeholder, {
                    duration: 1000,
                    type: 'div'
                });
                isChecked = false;
                return false;
            }
        })
       if (isChecked) {
            //以下代码判断是否合法 
        //1.对手机号输入,用户名输入进行正则判断,
        var mobile = $('.mobile').val().trim();
        if (!/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(mobile)) {
            mui.toast('手机号输入不合法', {
                duration: 1000,
                type: 'div'
            });
            return false;
        }
        //2.用户名
        var username = $('.username').val().trim();
                if (!/^[0-9a-zA-Z]{6,12}$/.test(username)) {
                    mui.toast('用户名不合法6-16之间的字母或者数字', {
                        duration: 1000,
                        type: 'div'
                    });
                    return false;
                }
        //3.进行密码和确认密码输入比对是否一致

        var password1 = $(".password1").val().trim();
        var password2 = $(".password2").val().trim();
        if (password2 != password1) {
            mui.toast('两次输入的密码不一致', {
                duration: 'long',
                type: 'div'
            });
            return false;
        }
        
        
   
        //判断验证码是否一致
        var vcode = $(".vcode").val().trim();
        // if (vcode !=vCode ) {
        //     mui.toast('验证码输入错误', {
        //         duration: 'long',
        //         type: 'div'
        //     });
        //     return false;
        // }
         // 发送请求
        $.ajax({
            url: '/user/register',
            type: 'post',
            data: {
                username: username,
                mobile: mobile,
                password: password1,
                vCode: vcode
            },
            success:function(data){
               if (data.error) {
                mui.toast(data.message, {
                            duration: 'long',
                            type: 'div'
                        });
               } else {
                location ='login.html?returnURL=user.html';
               }
            }
        })
       }
    })
   }
        //获取验证码
   $('.btn-get-vcode').on('tap', function () {
    $.ajax({
        url: '/user/vCode',
        success: function (data) {
            // console.log(data.vCode);
            $(".vcode").val(data.vCode);
           
        }
    })
})

   
})