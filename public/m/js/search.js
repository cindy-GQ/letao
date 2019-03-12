$(function () {
    //调用函数区域

    /* 1.添加数据 */
    addHistory();
    /* 2.查询数据 */
    searchHistory();
    /* 3.删除数据 */
    removeHistory();
     /* 4清空数据 */
    clearHistory();
    //5.初始化区域滚动
    categoryScroll()
    //6.点击历史记录跳转商品列表页面
    gotoProductlist()
    //-------------------------------------------------------------------------
   
    //js框架代码区域


    /* 1.添加数据 */
    function addHistory() {
        //给按钮添加点击事件
        $('.button-search').on('tap', function () {
            //获取当前输入框搜索的值,去掉前后空格trim()
            var searchValue = $('.input-search').val().trim();
            // console.log(searchValue);
            //判断输入searchValue值是否为空,
            if (searchValue == "") {
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
                if (currentLocalStorage[i].key == searchValue) {
                    currentLocalStorage.splice(i, 1);
                    i--;
                }
            }
            currentLocalStorage.unshift({
                key: searchValue,
                time: new Date().getTime()
            });
            // console.log(currentLocalStorage);
            //添加到本地存储
            localStorage.setItem('currentLocalStorage', JSON.stringify(currentLocalStorage));
            //调用本地存储数据
            searchHistory()
            //清空搜索完成后的value 的值
            $('.input-search').val('');
            //点击搜索,进入商品列表页面,进入商品列表,需要传参,根据搜素内容,显示相对应的列表,
            // 后面带个时间,随机数等等,作用:防止页面缓存,为了让重新请求是用的不是缓存
            location ='productlist.html?search='+ searchValue +'&time='+ new Date().getTime();
        });
        
    }
    /* 2.查询数据 */
    function searchHistory() {
        //获取数据,使用模板渲染页面,
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
        //调用模板
        var html = template('searchTpl',{list: currentLocalStorage});
        //把数据给到页面
        $('.search-history ul').html(html);

    }
    //声明全局变量,一开始为false
    var isDelete =false;
    /* 3.删除数据 */
    function removeHistory() {
        //给每个li的span加点击事件
        $('.search-history ul').on('tap','.search-del',function(){
            // console.log($(this));  
            // 获取当前点击索引
            var index = $(this).data('index');
            // console.log(index);
            //获取当前本地存储的数组,但因本地存储额是字符串,所以需要转为真正的数组
            var currentLocalStorage = JSON.parse(localStorage.getItem('currentLocalStorage'));
            // 当索引为index的时候,删除一个元素
            currentLocalStorage.splice(index,1);
            // console.log(currentLocalStorage);
            //删除完毕后,把数组转成字符串重新存储到localstorage
            localStorage.setItem('currentLocalStorage',JSON.stringify(currentLocalStorage));
            //再次调用查询,让页面有刷新的效果
            searchHistory()
            // 点击事件开始了,为true
            isDelete =true;
        })
    }
    
    /* 4清空数据 */
    function clearHistory() {
        
        //给清空加点击事件
        $('.search-clear').on('tap',function(){
            // 移出本地存储,不要用clear,clear会清除所有的本地key,不只是清除你当前你想删的key
            var currentLocalStorage = localStorage.removeItem('currentLocalStorage');
             //再次调用查询,让页面有刷新的效果
             searchHistory()
        })
    }
     //5.初始化区域滚动
     function categoryScroll(){
        mui('.mui-scroll-wrapper').scroll({
            indicators: false, //是否显示滚动条
            deceleration:0.0005, //阻尼系数,系数越小滑动越灵敏
            bounce: true //是否启用回弹
        });
    }
    //6.点击历史记录跳转相应数据商品列表页面,
    //6.1.当再次点击删除按钮,由于事件冒泡,也会进行页面跳转
    //解决:开关思想,声明全局变量为false
    //6.2当没有历史记录,点击提示信息不需跳转
    //解决:判断data值是否为空
   function gotoProductlist() {
       //给每个li添加点击事件,因为li是动态添加,进行事件委托添加事件
       $('.search-history .mui-table-view').on('tap','li',function(){
        //   console.log($(this));
     
        // 那么这里就要判断isDelete是否为false
        if (isDelete==false) {
            var searchValue = $(this).data('search');
             // console.log(searchValue);
            if(searchValue==null){
                // location.reload();
                return false;
            }else{
                location = 'productlist.html?search='+ searchValue +'&time='+new Date().getTime();
            }
        }
            //重新定义一下isDelete
            isDelete==false
        
       })
   }
})