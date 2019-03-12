$(function(){
    //函数调用区域
    queryUserMessage()
    exitLogin()
    //----------------------------------------------------------------------------------
    //框架js代码区域
    //查询用户信息
    function queryUserMessage() {
        // 发请求
        $.ajax({
            url:'/user/queryUserMessage',
            success:function(data){
                console.log(data);
                if (data.error){
                    location = 'login.html?returnURL='+location.href;
                }else{
                    var html = template('userTpl',data);
                    $('.userInfor').html(html);
                }
               
            }
        })
    }
    //退出登录
    function exitLogin() {
        //给按钮添加点击事件
        $('.btn-exit').on('tap',function(){
            $.ajax({
                url:'/user/logout',
                success:function(data){
                    if (data.success) {
                        location = 'login.html?returnURL='+location.href;
                    }
                }
            })
        })
    }
})