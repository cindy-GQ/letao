//定义一个全局变量接收参数
var proName = '';
$(function () {
    //调用函数区域
    //1.获取商品列表
    getProductList();
    //2.商品搜素功能
    searchProduct();
    //3.商品排序
    productSort();
    //4.商品刷新
    productReload();
    //5.点击购买按钮,进入商品详情页面
    gotoProductDetail();
    //-----------------------------------------------------------------------------------------------

    //js框架代码区域
    //根据地址栏路径获取参数
    function getQueryString(name) {

        var reg = new RegExp("[^\?&]?" + encodeURI(name) + "=[^&]+");
        var arr = location.search.match(reg);
        if (arr != null) {
            return decodeURI(arr[0].split('=')[1]);
        }
        return "";
    }
    //1.获取商品列表数据渲染页面
    function getProductList() {
        //获取当前搜索值
        proName = getQueryString('search');
        // console.log(proName);
        //发送请求
        $.ajax({
            url: '/product/queryProduct',
            data: {
                proName: proName,
                page: 1,
                pageSize: 4,
            },
            success: function (data) {
                // console.log(data);获取数据,准备模板,渲染页面
                // 调用模板
                var html = template('productListTpl', data);
                $('.prolist-content').html(html);
            }
        })

    }
    //2.点击搜索框实现商品搜索功能
    function searchProduct() {
        //给按钮添加点击事件
        $('.button-search').on('tap', function () {
            //获取当前输入框搜索的值,去掉前后空格trim()
            proName = $('.input-search').val().trim();
            // console.log(searchValue);
            //判断输入searchValue值是否为空,
            if (proName == "") {
                mui.toast('请输入你要搜索的商品', {
                    duration: 'long',
                    type: 'div'
                });
                return false;
            }
            //获取当前本地存储的值,如果有值,在其前面插入,没有就给个空数组存放值
            // var currentLocalStorage = JSON.parse(localStorage.getItem('currentLocalStorage')) || [];
            var currentLocalStorage = localStorage.getItem('currentLocalStorage');
            // console.log(currentLocalStorage);
            //判断之前存储是否有值
            if (currentLocalStorage) {
                //有,把它转成一个数组
                currentLocalStorage = JSON.parse(currentLocalStorage);
            } else {
                //没有就给一个空数组
                currentLocalStorage = [];
            }
            //对于重复搜索,进行数组去重
            for (var i = 0; i < currentLocalStorage.length; i++) {
                if (currentLocalStorage[i].key == proName) {
                    currentLocalStorage.splice(i, 1);
                    i--;
                }
            }
            currentLocalStorage.unshift({
                key: proName,
                time: new Date().getTime()
            });
            // console.log(currentLocalStorage);
            //添加到本地存储
            localStorage.setItem('currentLocalStorage', JSON.stringify(currentLocalStorage));

            //清空搜索完成后的value 的值
            $('.input-search').val('');
            //点击搜索,进入商品列表页面,进入商品列表,需要传参,根据搜素内容,显示相对应的列表,
            // 后面带个时间,随机数等等,作用:防止页面缓存,为了让重新请求是用的不是缓存
            location = 'productlist.html?search=' + proName + '&time=' + new Date().getTime();
        });

    }
    //3.商品排序功能
    function productSort() {
        //给每个头部导航a加点击事件,
        $('.product-nav a').on('tap', function () {
            $(this).addClass('active').siblings().removeClass('active');
            //获取当前排列方式
            var sort = $(this).data('sort');
            // console.log(sort);
            //判断,如果当前是降序,就改为升序图标相应更改
            if (sort == 2) {
                sort = 1;
                $(this).find('i').removeClass('fa-angle-down').addClass('fa-angle-up')
            } else {
                sort = 2;
                $(this).find('i').removeClass('fa-angle-up').addClass('fa-angle-down')
            }
            //修改完了属性页面重新赋值刷新,不然始终都只是一样的值
            $(this).data('sort', sort);
            //获取排序类型
            var type = $(this).data('type');
            //参数对象
            var obj = {
                proName: proName,
                page: 1,
                pageSize: 4,
            }
            //需要给参数对象添加动态属性,所以把这个参数单独处理添加
            obj[type] = sort;
            //发请求刷新页面
            $.ajax({
                url: '/product/queryProduct',
                data: obj,
                success: function (data) {
                    // console.log(data);获取数据,准备模板,渲染页面
                    // 调用模板
                    var html = template('productListTpl', data);
                    $('.prolist-content').html(html);
                }
            })
        })
    }
    //4.上拉下拉刷新
    function productReload() {
        //初始化上下拉
        mui.init({
            pullRefresh: {
                container: '#pullrefresh',
                down: {
                    contentdown: "下拉可以刷新", //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
                    contentover: "释放立即刷新", //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
                    contentrefresh: "正在刷新...", //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
                    callback: pulldownRefresh
                },
                up: {
                    contentrefresh: "正在加载...", //可选，正在加载状态时，上拉加载控件上显示的标题内容
                    contentnomore: '没有更多数据了', //可选，请求完毕若没有更多数据时显示的提醒内容；
                    callback: pullupRefresh
                }
            }
        });
        /**
         * 下拉刷新具体业务实现
         */
        function pulldownRefresh() {
            setTimeout(function () {
                getProductList()
                mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
            }, 1500);
        }
        var page = 1;
        /**
         * 上拉加载具体业务实现
         */
        function pullupRefresh() {
            setTimeout(function () {
                $.ajax({
                    url: '/product/queryProduct',
                    data: {
                        proName: proName,
                        page: ++page,
                        pageSize: 4,
                    },
                    success: function (data) {
                        //判断,如果有数据就发请求追加数据,没有就结束转圈圈
                        if (data.data.length > 0) {
                            // console.log(data);获取数据,准备模板,渲染页面
                            // 调用模板
                            var html = template('productListTpl', data);
                            $('.prolist-content').append(html);
                            mui('#pullrefresh').pullRefresh().endPullupToRefresh();
                        } else {
                            // 9. 没有数据 结束转圈圈 并且提示没有数据了
                            mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
                        }

                    }
                })

            }, 1500);
        }
    }
    //5.点击购买按钮,进入商品详情页面
    function gotoProductDetail() {
        //给所有按钮添加点击事件,获取id,
        $('.product-list').on('tap','.product-buy',function(){
            // console.log(this);
            var id = $(this).data('id');
            // console.log(id);
            location = 'detail.html?id='+ id ;
        })
    }
})