var Inlay = {
    "getParam": function () {
    }, // 获得参数
    "getInput": function () {
    },  // xml文件参数
    "path" : []
};

$(document).ready(function(){
    setImgUl('zysh');
    $('#tabul_select').on('click','img',function(e){
        var selectNode = $(e.target).parent().prev();
        if(selectNode.attr('class') == undefined || selectNode.attr('class') == ''){
            selectNode.addClass('selectedImg');
            Inlay.path.push($(e.target).attr('data-path'));
        }
    })

    $('#tabul_select').on('click','div',function(e){
        $(e.target).removeClass('selectedImg');
        Inlay.path.remove(Inlay.path.indexOf($(e.target).next().children('img').attr('data-path')))
    });

    $('#executeAlg').click(function(){
        var input = Inlay.path.length + '\n';
        for(var i = 0; i < Inlay.path.length; i++){
            input += Inlay.path[i] + '\n';
        }

        getDemResult(input);
    })

})

function getParam(input){
    return {
        "file":"\\user\\guowei\\process\\" + new Date().getTime() + parseInt(Math.random()*10E10).toString() +'.orsMosaic',
        "content":input
    }
}
function getDemResult(input){
    $.post('http://'+ configInfo.serverIp +':8081/fsServer/createFile/', JSON.stringify(getParam(input)), function (data) {
        var input = {"req.type": "OpenImage", "filepath": data};
        updateMap(input,"resultmap");
    })
}

function setJpages(name){
    $(".holder_" + name).jPages({
        containerID: "tabul_" + name,
        previous: '上一页',
        next: '下一页',
        perPage: 10,
        startPage: 1,
        startRange: 1,
        midRange: 5,
        endRange: 1
    });
}

function setImgUl(dirname) {
    var parm = '{"path":"\\\\public\\\\' + dirname + '","type":["tif"]}';
    $.post('http://'+ configInfo.serverIp +':8081/fsServer/fileMetaInfo/', parm, function (data) {
        var imgdata = JSON.parse(data)['tif'];
        var imgString = '';
        for (var i = 0; i < imgdata.length; i++) {
            var imgUrl = 'http://'+ configInfo.serverIp +':8081/fsServer/thumbnail/?path=' + imgdata[i].path + '.thumb.jpg';
            var imgPath = imgdata[i].path.slice(0, imgdata[i].path.length - 3) + 'tif';
            imgString += '<li><div> </div><a><img onerror="this.src=\'' + imgUrl + '\'" data-path="' + imgPath + '" src="' + imgUrl + '"><span>' + imgdata[i].name + '</span></a></li>';
        }
        $('#tabul_select').html(imgString);
        setJpages('select');
    })
}

Array.prototype.remove = function (dx) {
    if (isNaN(dx) || dx > this.length) {
        return false;
    }
    for (var i = 0, n = 0; i < this.length; i++) {
        if (this[i] != this[dx]) {
            this[n++] = this[i]
        }
    }
    if (this.length > 0) {
        this.length = this.length - 1
    }
}