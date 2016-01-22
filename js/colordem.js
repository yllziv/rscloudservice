var Dem = {
    "getParam": function () {
    }, // 获得参数
    "getInput": function () {
    },  // xml文件参数
    path : []
};


Dem.getParam = function (user, path,color) {
    return {
        "file": '\\user\\' + user + '\\process\\' + new Date().getTime() + parseInt(Math.random() * 10E10).toString() + '.chain',
        "content": Dem.getInput(path,color)
    }
}

Dem.getInput = function (path,color) {
    return '<OpenRS_Cloud>' +
        '	<node>' +
        '		<type type="string">file</type>' +
        '		<val type="string">' + path + '</val>' +
        '	</node>' +
        '		<node>' +
        '		<type type="string">alg</type>' +
        '		<val type="string">ors.dataSource.image.refReader</val>' +
        '		<param>' +
        '			<InputSources />' +
        '			<ParameterArgs>' +
        '				<WKT type="string">auto_wgs84_project</WKT>' +
        '				<Resample type="int32">1</Resample>' +
        '			</ParameterArgs>' +
        '			<OutputSources />' +
        '		</param>' +
        '	</node>' +
        '	<node>' +
        '		<type type="string">alg</type>' +
        '		<val type="string">ors.dataSource.image.3DAnalyst.default</val>' +
        '		<param>' +
        '			<InputSources />' +
        '			<ParameterArgs>' +
        '				<Altitude type="float64">45.00000000</Altitude>' +
        '				<Azimuth type="float64">315.00000000</Azimuth>' +
        '				<ColorTableNo type="int32">'+color+'</ColorTableNo>' +
        '				<Max_Value type="float64">0.00000000</Max_Value>' +
        '				<Min_Value type="float64">0.00000000</Min_Value>' +
        '				<Transparency type="float64">50.00000000</Transparency>' +
        '				<cell_size type="int32">3</cell_size>' +
        '			</ParameterArgs>' +
        '			<OutputSources />' +
        '		</param>' +
        '	</node>' +
        '</OpenRS_Cloud>'
}

$(document).ready(function () {
    setImgUl('dem');
    $('#tabul_select').on('click','img',function(e){
        if($(e.target).attr('class') == undefined || $(e.target).attr('class') == ''){
            $(e.target).addClass('imgclicked');
            Dem.path = [];
            Dem.path.push($(e.target).attr('data-path'));
        }else {
            $(e.target).removeClass('imgclicked');
            Dem.path.remove(Dem.path.indexOf($(e.target).attr('data-path')))
        }
    })

    $('#confirm').click(function(){
        var input = {"req.type": "OpenImage", "filepath": Dem.path[0]};
        updateMap(input,"leftconetent");
        window.parent.$('#selectDem').bPopup().close();
    })
    $('#openDem').click(function(){
        $('#selectDem').bPopup({
            speed: 650,
            closeClass: 'close1',
            follow: [true, true],
            escClose: false,
            modalClose: false,
            transitionClose: 'slideBack'
        });
        setJpages();
    })
    $('#selectDem img:eq(0)').click(function () {
        window.parent.$('#selectDem').bPopup().close();
    })
    $('#executeAlg').click(function(){
        var param = Dem.getParam('guowei', Dem.path[0],'11')
        getDemResult(param);
    })

    $('#select_input').click(function(){
        $('#bmps').show();
        $('#arrow').css("border-color","transparent transparent #197afe transparent");
        $('#arrow').css("top","7px");
    });
    $('.bmp_list').hover(function(e){
        var targetsrc = $(e.target).children().attr("src");
        $('#select_input img').attr("src",targetsrc);

    });
    $('.bmp_list img').click(function(e){
        $('#rightcontent').html('');
        var targetsrc = $(e.target).attr("src");
        $('#select_input img').attr("src",targetsrc);
        var colorIndex = targetsrc.slice(targetsrc.indexOf('ct') + 2 ,targetsrc.indexOf('bmp') - 1);
        $('#bmps').hide();
        $('#arrow').css("border-color","#197afe transparent transparent transparent");
        $('#arrow').css("top","17px");
        var param = Dem.getParam('guowei', Dem.path[0],colorIndex.toString())
        getDemResult(param);
    })

})

function getDemResult(param){
    $.post('http://'+ configInfo.serverIp +':8081/fsServer/createFile/', JSON.stringify(param), function (data) {
        var input = {"req.type": "OpenImage", "filepath": data};
        updateMap(input,"rightcontent");
    })
}

function setImgUl(dirname) {
    var parm = '{"path":"\\\\public\\\\' + dirname + '","type":["tif"]}';
    $.post('http://'+ configInfo.serverIp +':8081/fsServer/fileMetaInfo/', parm, function (data) {
        var imgdata = JSON.parse(data)['tif'];
        var imgString = '';
        for (var i = 0; i < imgdata.length; i++) {
            var imgUrl = 'http://'+ configInfo.serverIp +':8081/fsServer/thumbnail/?path=' + imgdata[i].path + '.thumb.jpg';
            var imgPath = imgdata[i].path.slice(0, imgdata[i].path.length - 3) + 'tif';
            imgString += '<li><a><img onerror="this.src=\'' + imgUrl + '\'" data-path="' + imgPath + '" src="' + imgUrl + '"><span>' + imgdata[i].name + '</span></a></li>';
        }
        $('#tabul_select').html(imgString);
    })
}

function setJpages(){
    $(".holder_select").jPages({
        containerID: "tabul_select",
        previous: '上一页',
        next: '下一页',
        perPage: 10,
        startPage: 1,
        startRange: 1,
        midRange: 5,
        endRange: 1
    });
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