$(document).ready(function(){
    //var a = $('.imgProduct');
    //a.hover(showElem, outElem);
    var input = {"req.type": "OpenImage", "filepath": "C:\\Users\\server\\Desktop\\Server\\TestData\\public\\product\\0.2\\LHK_IMG_0_2.IMG"};
    updateMap(input,"maplaohekou");
});

//function showElem(e){
//    console.log(e.target);
//    if(e.target.className == "maskLayer") {
//        $(e.target).animate({opacity: 1},500);
//        $(e.target.nextElementSibling).animate({opacity: 1, left:"30px" },500);
//
//    }
//}
//function outElem(e){
//    if(e.target.className == "maskLayer") {
//        $(e.target).animate({opacity: 0},500);
//        $(e.target.nextElementSibling).animate({opacity: 0, left:"0px" },500);
//    }
//}