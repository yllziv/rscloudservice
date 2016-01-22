var popup = null;
$(document).ready(function () {
    $('#instance_openRS').click(function () {
        window.location.href = './cloudplat/OpenRS.html?instance_openRS'
    })
    $('#instance_arcgis').click(function () {
        window.location.href = './cloudplat/ArcGIS.html?instance_arcgis'
    })
    $('#instance_erdas').click(function () {
        window.location.href = './cloudplat/ERDAS.html?instance_erdas'
    })
    $('#instance_envi').click(function () {
        window.location.href = './cloudplat/ENVI.html?instance_envi'
    });
    $('#instance_office').click(function () {
        window.location.href = './cloudplat/Office.html?instance_office'
    });
    setImgUl('zysh');
    $('#ul_zysh').click(function () {
        setImgUl('zysh');
    });
    $('#ul_shp').click(function () {
        setImgUl('shp');
    });
    $('#ul_dem').click(function () {
        setImgUl('dem');
    });
    $('#ul_gfyh').click(function () {
        setImgUl('gfyh');
    });
    $('#ul_gfeh').click(function () {
        setImgUl('gfeh');
    });

    $('#topfloatlayer img:eq(0)').click(function () {
        popup.close();
    })


    var lastClick = {};

    $('#topfloatlayer img:eq(1)').click(function () {
        if (!$('#mapfloatlayer').attr('class')) {
            lastClick.width = $('#mapfloatlayer').css('width');
            lastClick.height = $('#mapfloatlayer').css('height');
            lastClick.margin = $('#mapfloatlayer').css('margin');
            lastClick.left = $('#mapfloatlayer').css('left');
            lastClick.top = $('#mapfloatlayer').css('top');
            $('#mapfloatlayer').css('width', '100% ');
            $('#mapfloatlayer').css('height', '100% ');
            $('#map').css('height',$('#mapfloatlayer').height() - 15 +'px');
            $('#map').css('width',$('#mapfloatlayer').width() - 320 +'px');
            map.resize()
            $('#mapfloatlayer').css('margin', '0 ');
            $('#mapfloatlayer').css('left', '0');
            $('#mapfloatlayer').css('top', '0');
            $('#mapfloatlayer').addClass('clicked');
        }else{
            $('#mapfloatlayer').css('width',lastClick.width);
            $('#mapfloatlayer').css('height', lastClick.height);
            $('#map').css('height','670px');
            $('#map').css('width',$('#mapfloatlayer').width() - 320 +'px');
            map.resize()
            $('#mapfloatlayer').css('margin', lastClick.margin);
            $('#mapfloatlayer').css('left', lastClick.left);
            $('#mapfloatlayer').css('top', lastClick.top);
            $('#mapfloatlayer').removeClass('clicked');
        }
    })

    $('ul.index3-ul1-list').on('click','img',function(e){
        var imgpath = ($(e.target).attr('data-path'));
        var input = {"req.type": "OpenImage", "filepath": imgpath};

        updateMap(input,"map");
        $('#imgThumbnail').attr('src',($(e.target).attr('src')));
        $('#imgThumbnailTitle').html(($(e.target).siblings().html()));
        popup = $('#mapfloatlayer').bPopup({
            speed: 650,
            closeClass: 'close1',
            follow: [true, true],
            escClose: false,
            modalClose: false,
            transitionClose: 'slideBack'
        });
    })
})

function createIframe(name) {
    $.get('http://'+ configInfo.serverIp +':8082/openstack/getConsoleUrl?name=' + name, function (data) {
        window.open('./instance.html?' + data);
    })
}

function setImgUl(dirname) {
    $('#ul_' + dirname).addClass('active');
    $('#tabul_' + dirname).parent().show();
    $('#tabul_' + dirname).parent().siblings().hide();
    $('#ul_' + dirname).siblings().removeClass('active');
    var parm = '{"path":"\\\\public\\\\' + dirname + '","type":["tif"]}';
    $.post('http://'+ configInfo.serverIp +':8081/fsServer/fileMetaInfo/', parm, function (data) {
        var imgdata = JSON.parse(data)['tif'];
        var imgString = '';
        for (var i = 0; i < imgdata.length; i++) {
            var imgUrl = 'http://'+ configInfo.serverIp +':8081/fsServer/thumbnail/?path=' + imgdata[i].path + '.thumb.jpg';
            var imgPath = imgdata[i].path.slice(0, imgdata[i].path.length - 3) + 'tif';
            imgString += '<li><a><img onerror="this.src=\'' + imgUrl + '\'" data-path="' + imgPath + '" src="' + imgUrl + '"><span>' + imgdata[i].name + '</span></a></li>';
        }
        $('#tabul_' + dirname).html(imgString);
        setJpages(dirname);
    })
}

function setJpages(dirname) {
    $(".holder_" + dirname).jPages({
        containerID: "tabul_" + dirname,
        previous: '上一页',
        next: '下一页',
        perPage: 10,
        startPage: 1,
        startRange: 1,
        midRange: 5,
        endRange: 1
    });
}