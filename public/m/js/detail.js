$(function () {
    // 代码调用区域
    categoryScroll();
    queryDetail();
    addCart()


    //-------------------------------------------------------------------------------------
    // 框架代码区域
    //1.详情页面发送请求,通过id或去数据获取数据,渲染页面
    function queryDetail() {
        var id = getQueryString('id');
        //   console.log(id);
        // 发请求
        $.ajax({
            url: '/product/queryProductDetail',
            data: {
                id: id,
            },
            success: function (data) {
                // console.log(data);
                //拿到我们需要的尺码
                var arr = data.size.split('-');
                // console.log(arr);
                //定义一个空数组,存放我们需要的size
                var size = [];
                //遍历arr,记得做隐式类型转换,arr里面的元素是字符串
                for (var i = +arr[0]; i <= arr[1] - 0; i++) {
                    size.push(i);
                }
                // console.log(size);
                data.size = size;
                //调用模板
                var html = template('detailTpl', data);
                $('.prodetail').html(html);
                initSlider();
                //初始化数字输入框
                mui('.mui-numbox').numbox();
                // //区域滚动初始化
                // categoryScroll();
                //给每个size按钮添加点击事件,给当前点击的按钮添加类名
                $('.detail-size').on('tap', 'button', function () {
                    $(this).addClass('mui-btn-warning').siblings().removeClass('mui-btn-warning');
                })
            }
        })
    }
    /* 2.添加购物车
    获取数据,点击添加购物车按钮,
    判断是否,登录,
    未登录就跳转登录页面,并带上详情页面地址,
    登录完毕后回到详情页面 */
    function addCart() {
        //给添加购物车按钮,加点击事件
        $('.add-cart').on('tap',function(){
            //获取id,num ,size等数据,发送请求
            var id = getQueryString('id');
            // console.log(id);
            var num =mui('.mui-numbox').numbox().getValue();
            // console.log(num);
            var size = $('.mui-btn.mui-btn-warning').data('size');
            // console.log(size);
            //发请求
            $.ajax({
                type:'post',
                url:'/cart/addCart',
                data:{
                    productId:id,
                    num:num,
                    size:size,
                },
                success:function(data){
                    // console.log(data);
                    //判断是否登录
                    if (data.error) {
                        //跳转登录页面,要带上详情页的地址,
                        location = 'login.html?returnURL='+location.href;
                    }else{
                        //跳转到购物车页面,可以让用户先确认是否要跳转
                        mui.confirm( '<h4>是否查看购物车</h4>', '<h4>温馨提示</h4>', ['是','否'], function(e){
                            //判断是否跳转到购物车
                            if (e.index==1) {
                                mui.toast('请继续购买',{ duration:'long', type:'div' }) 
                            }else{
                                location = 'cart.html';
                            }
                        } )
                    }
                }
            })
        })
    }
    //初始化区域滚动
    function categoryScroll() {
        mui('.mui-scroll-wrapper').scroll({
            indicators: false, //是否显示滚动条
            deceleration: 0.0005, //阻尼系数,系数越小滑动越灵敏
            bounce: true //是否启用回弹
        });
    }
    //初始化轮播区域
    function initSlider() {
        var gallery = mui('.mui-slider');
        gallery.slider({
            interval: 2000, //自动轮播周期，若为0则不自动播放，默认为0；
        });
    }
    //根据地址栏路径获取参数
    function getQueryString(name) {

        var reg = new RegExp("[^\?&]?" + encodeURI(name) + "=[^&]+");
        var arr = location.search.match(reg);
        if (arr != null) {
            return decodeURI(arr[0].split('=')[1]);
        }
        return "";
    }
})