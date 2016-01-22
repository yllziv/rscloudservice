$(document).ready(function(){
    $('.iframePage').height('2391px');
    toggleClass($('.navbar li:eq(0)'));
    $('.navbar li').click(function(e){
        var navName = $(e.target).html();
        choosePage(navName,$(e.target))
    })
})

function choosePage(navName,target){
    switch(navName){
        case '首页':
            $('.iframePage').attr('src','./home.html');
            $('.iframePage').height('2391px');
            toggleClass(target);
            break;
        case '应用中心':
            $('.iframePage').attr('src','./appcenter.html');
            $('.iframePage').height('1500px');
            toggleClass(target);
            break;
        case '地图产品':
            $('.iframePage').attr('src','./laohekou.html');
            $('.iframePage').height('1200');
            toggleClass(target);
            break;
        //case '数据中心':
        //    $('.iframePage').attr('src','./数据中心.html');
        //    $('.iframePage').height('1000px');
        //    toggleClass(target);
        //    break;
    }
}

function toggleClass(target){
    target.addClass('clicked');
    target.siblings().removeClass('clicked');
}

function scrollToTop(){
    document.getElementsByTagName('body')[0].scrollTop=0;
}
