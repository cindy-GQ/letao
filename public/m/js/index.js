$(function(){
    // 初始化mui滑动
    mui('.mui-scroll-wrapper').scroll({
        deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    });
    //swiper轮播初始化代码
    /*var swiper = new Swiper('.swiper-container', {
       //无限循环
        loop:true,
        // 自动轮播
        autoplay: {
          delay: 2000,
          disableOnInteraction: false,
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        
      }); */ 

    //MUI轮播初始化js
    var gallery = mui('.mui-slider');
    gallery.slider({
        interval:2000//自动轮播周期，若为0则不自动播放，默认为0；
     });

})