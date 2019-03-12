$(function(){
    // 调用
    categoryscroll();
    categoryleftajax();
    categoryrightajax(1);
    categorylefttap();

    //-------------------------------------------------------------------------------------------
    //1.初始化区域滚动
    function categoryscroll(){
        mui('.mui-scroll-wrapper').scroll({
            indicators: false, //是否显示滚动条
            deceleration:0.0005, //阻尼系数,系数越小滑动越灵敏
            bounce: true //是否启用回弹
        });
    }
    //2.获取侧边导航信息添加给页面
    function categoryleftajax(){
        /* 1.发送ajax请求数据
           2.使用模板引擎
           3.调用模板
           4.添加到页面*/
           $.ajax({
              url:'/category/queryTopCategory',
              success:function(data){
                //   console.log(data);
                //使用模板函数调用模板
                var html = template('categoryLeftTpl',data);
                //添加到页面
                $('.category-left ul').html(html);
              }
           })
    }
    //声明变量记录id;
    var oldId =0 ;
    // 3.左侧导航点击事件,点击切换右边分类
    function categorylefttap(){
        $('.category-left ul').on('tap','li',function(){
            $(this).addClass('active').siblings().removeClass('active');
            //当点击左侧分类,右侧分类会根据id进行切换,获取当前id
            // console.log($(this).data('id'));
            var id = $(this).data('id');
            //判断当前id是否与之前重复,重复就不在请求右边分类,不重复就继续
            if (id==oldId) {
                return false;
            }
            categoryrightajax(id);
            oldId = id;
        })
    }

    //获取右边品牌信息添加给页面
    function categoryrightajax(id){
           $.ajax({
              url:'/category/querySecondCategory',
              data:{
                  id:id,
              },
              success:function(data){
                //   console.log(data);
                //使用模板函数调用模板
                var html = template('categoryRightTpl',data);
                //添加到页面
                $('.category-right .mui-row').html(html);
              }
           })
    }

})