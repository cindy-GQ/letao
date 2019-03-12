$(function () {
    //函数调用区域
    queryCart()
    deleteCart()
    editCart()
   
    //-----------------------------------------------------------------------
    //框架js
    //查询购物车
    function queryCart() {
        $.ajax({
            url: '/cart/queryCart',
            success: function (data) {
                //判断用户 是否登录.如果未登录,先登录再跳转回当前页面,如果登录了,直接调用模板
                if (data.error) {
                    //跳转登录页面,要带上详情页的地址,
                    location = 'login.html?returnURL=' + location.href;
                } else {
                    //这里数据返回的是数组不是一个对象,所以要装进对象里包装一下
                    var html = template('cartProductTpl', {
                        data: data
                    })
                    // console.log(html);
                    $('.cart-list').html(html);
                    //区域滚动初始化
                    initScroll()
                    getCount()
                    //要给所有复选框加一个值改变事件
                    $('.mui-checkbox input').on('change',function(){
                        getCount()
                    })
                    
                }
            }
        })
    }
    //删除购物车
    function deleteCart() {
        /*  给删除按钮添加点击事件,注意按钮时动态添加的,所以依赖于委托, 
            出现弹框,提示用户是否确定删除,点击取消,就取消,滑动回去,
            点击确定,就调用删除的api*/
        $('.cart-list').on('tap', '.btn-del', function () {
            var elem = this;
            var li = elem.parentNode.parentNode;
            id = $(this).data('id');
            mui.confirm('真的要删除我吗?', '温馨提示', ['确定', '取消'], function (e) {
                //判断是否真的删除
                if (e.index == 1) {
                    setTimeout(function () {
                       mui.swipeoutClose(li);
                    }, 0);
                }else{
                    $.ajax({
                        url:'/cart/deleteCart',
                        data:{
                            id:id,
                        },
                        success:function(data){
                            // console.log(data);
                            //判断是否删除成功
                            if (data.success) {
                                mui.toast('删除成功',{ duration:'long', type:'div' });
                                //再次刷新页面
                                queryCart();
                            }else{
                                //可能是网络不行,先不判断
                                mui.toast('网络加载中,请刷新再试',{ duration:'long', type:'div' });

                            }
                            
                        }
                    })
                }
                
            })
        })

    }
    //编辑购物车
    function editCart() {
        $('.cart-list').on('tap',".btn-edit",function(){
            var li = this.parentNode.parentNode;
            var product = $(this).data('product');
            //获取所有尺码
            var getSize = product.productSize.split('-');
            // console.log(getSize);
            //定义一个空数组,存放处理后所有的尺寸
            var productSize = [];
            //遍历getSize
            for (var i = + getSize[0]; i <= getSize[1] - 0; i++) {
                productSize.push(i);
            }
            // console.log(productSize);
            //重新数据中的productSize
            product.productSize = productSize;
             //调用模板
             var html = template('editorTpl',product)
             //html提交前还需要去掉空格回车换行
             html =html.replace(/[\r\n]/g, "");
            mui.confirm(html, '温馨提示', ['确定', '取消'], function (e) {
                //判断是否真的删除
                if (e.index == 1) {
                       mui.swipeoutClose(li);
                }else{
                    //获取当前选中的size
                    var size = $('.mui-btn.mui-btn-warning').data('size');
                    //获取当前的数量
                    var num =mui('.mui-numbox').numbox().getValue();
                    $.ajax({
                        url:'/cart/updateCart',
                        type:'post',
                        data:{
                            id:product.id,
                            size:size,
                            num:num,
                        },
                        success:function(data){
                            // console.log(data);
                            if (data.success) {
                            queryCart()
                            }
                        }
                    })
                }
                
            })
             //初始化数字输入框
             mui('.mui-numbox').numbox();
             // //区域滚动初始化
             // categoryScroll();
             //给每个size按钮添加点击事件,给当前点击的按钮添加类名
             $('.detail-size').on('tap', 'button', function () {
                 $(this).addClass('mui-btn-warning').siblings().removeClass('mui-btn-warning');
             })
        })
    }
    //计算支付总金额 
    function getCount() {
        /* 先获取所有被选中的复选框
            遍历,获取价格和数量
            进行计算
            把最后的结果渲染页面 */
            var checkeds = $('.mui-checkbox input:checked');
            // console.log(checkeds);
            var sum = 0;
            checkeds.each(function(){
                var price = $(this).data('price');
                var num = $(this).data('num');
                var allCount = price * num;
                sum+=allCount;
            })
            sum = sum.toFixed(2);
            $('.order-total span').html(sum);
    }

    //初始化滚动
    function initScroll() {
        mui('.mui-scroll-wrapper').scroll({
            indicators: false, //是否显示滚动条
            deceleration: 0.0006, //阻尼系数,系数越小滑动越灵敏
            bounce: true //是否启用回弹
        });
    }
})