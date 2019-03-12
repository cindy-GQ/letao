$(function(){
    //函数调用区域
    login()
    register()

    //----------------------------------------------------------------
    //框架代码区域
    /* 点击登录,获取输入的密码和用户名,发请求,登录成功就跳转详情页面,失败就重新登录*/
    function login() {
        $('.btn-login').on('tap',function(){
            //判断用户名及 密码的时候,确认是否为空
            var username = $('.username').val().trim();
            if(username==''){
                mui.toast('请输入用户名',{ duration:'long', type:'div' });
                return false;
            }
            var password = $('.password').val().trim();
            if(password==''){
                mui.toast('请输入密码',{ duration:'long', type:'div' });
                return false;
            }
            $.ajax({
                type:'post',
                url:'/user/login',
                data:{
                    username:username,
                    password:password,
                },
                success:function(data){
                    // console.log(data);
                    //判断是否登录成功
                    if (data.error) {
                        mui.alert( '用户名或密码错误,请重新输入', '温馨提示',);
                    }else{
    
                        location = getQueryString('returnURL');
                    }
                }
            })
        })
         //根据地址栏路径获取参数
         function getQueryString(name) {
    
            var reg = new RegExp("[^\?&]?" + encodeURI(name) + "=[^&]+");
            var arr = location.search.match(reg);
            if (arr != null) {
                return decodeURI(arr[0].substr(arr[0].indexOf('=') + 1));
            }
            return "";
        }
    }
    //注册
    function register() {
        $('.btn-register').on('tap',function(){
            location = 'register.html?returnURL='+location.href;
        })
    }
})