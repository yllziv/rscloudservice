var Correct = {
    "getParam": function () {
    }, // 获得参数
    "getInput": function () {
    },  // xml文件参数
    pathDem: [],  // DEM影像的路径
    pathDem2: [],  // 遥感影像的路径
    resutltPath: '', // 结果文件保存的路径
    process: null,     // 时间定时器，5秒循环一次
    jobID:''          // 任务id
};
$.ajaxSetup({
    async: false
});

Correct.getParam = function (demPath, imgPath, outputPath) {
    return {
        "username": "guoweqi",
        "jobType": "123",
        "jobInfo": "123",
        "algID": "ors.execute.parallel_l.dsmMatch",
        "inputParams": Correct.getInput(demPath, imgPath, outputPath),
        "priority": 1,
        "timeOut": 60000
    }
}

Correct.getInput = function (demPath, imgPath, outputPath) {
    return '<OpenRS_Cloud>' +
    '    <InputFileNames>' +
    '        <LeftImageFile type="string">' + imgPath + '</LeftImageFile>' +
    '        <RightImageFile type="string">' + demPath + '</RightImageFile>' +
    '    </InputFileNames>' +
    '    <OutputFileNames>' +
    '        <demFile type="string">' + outputPath + '</demFile>' +
    '    </OutputFileNames>' +
    '    <ParameterArgs>' +
    '        <BlockRows type="int32">4096</BlockRows>' +
    '        <BlockCols type="int32">4096</BlockCols>' +
    '        <GridDx type="int32">3</GridDx>' +
    '        <GridDy type="int32">3</GridDy>' +
    '        <CoefWinSize type="int32">9</CoefWinSize>' +
    '        <BlockBorderSize type="int32">128</BlockBorderSize>' +
    '        <ClipRows type="int32">128</ClipRows>' +
    '        <ClipCols type="int32">128</ClipCols>' +
    '        <demGSD type="float64">0.00000000</demGSD>' +
    '        <wktHCS type="string"></wktHCS>' +
    '    </ParameterArgs>' +
    '    <ROI_in_Pixels>' +
    '        <BeginRow type="int32">0</BeginRow>' +
    '        <NumOfRows type="int32">0</NumOfRows>' +
    '        <BeginCol type="int32">0</BeginCol>' +
    '        <NumOfCols type="int32">0</NumOfCols>' +
    '    </ROI_in_Pixels>' +
    '    <Num_Of_Processes type="int32">2</Num_Of_Processes>' +
    '</OpenRS_Cloud>';
}

$(document).ready(function () {
    setImgUl('zysh', 'selectDem');
    setImgUl('zysh', 'selectDem2');
    $('#openDem').click(function () {
        $('#selectDem').bPopup({
            speed: 650,
            closeClass: 'close1',
            follow: [true, false],
            escClose: false,
            modalClose: false,
            transitionClose: 'slideBack'
        });
        setJpages('selectDem');
    })
    $('#openImg').click(function () {
        $('#selectDem2').bPopup({
            speed: 650,
            closeClass: 'close1',
            follow: [true, false],
            escClose: false,
            modalClose: false,
            transitionClose: 'slideBack'
        });
        setJpages('selectDem2');
    })
    $('#selectDem img:eq(0)').click(function () {
        window.parent.$('#selectDem').bPopup().close();
    })
    $('#selectDem2 img:eq(0)').click(function () {
        window.parent.$('#selectDem2').bPopup().close();
    })
    $('#tabul_selectDem').on('click', 'img', function (e) {
        if ($(e.target).attr('class') == undefined || $(e.target).attr('class') == '') {
            $(e.target).addClass('imgclicked');
            Correct.pathDem = [];
            Correct.pathDem.push($(e.target).attr('data-path'));
        } else {
            $(e.target).removeClass('imgclicked');
            Correct.pathDem.remove(Correct.path.indexOf($(e.target).attr('data-path')))
        }
    })
    //$('#tabul_selectDem').on('click','img',function(e){
    //    var selectNode = $(e.target).parent().prev();
    //    if(selectNode.attr('class') == undefined || selectNode.attr('class') == ''){
    //        selectNode.addClass('selectedImg');
    //        Correct.pathDem = [];
    //        Correct.pathDem.push($(e.target).attr('data-path'));
    //    }
    //})
    //
    //$('#tabul_selectDem').on('click','div',function(e){
    //    $(e.target).removeClass('selectedImg');
    //    Correct.pathDem.remove(Correct.pathDem.indexOf($(e.target).next().children('img').attr('data-path')))
    //});

    $('#tabul_selectDem2').on('click', 'img', function (e) {
        if ($(e.target).attr('class') == undefined || $(e.target).attr('class') == '') {
            $(e.target).addClass('imgclicked');
            Correct.pathDem2 = [];
            Correct.pathDem2.push($(e.target).attr('data-path'));
        } else {
            $(e.target).removeClass('imgclicked');
            Correct.pathDem2.remove(Correct.path.indexOf($(e.target).attr('data-path')))
        }
    })
    //$('#tabul_selectDem2').on('click','img',function(e){
    //    var selectNode = $(e.target).parent().prev();
    //    if(selectNode.attr('class') == undefined || selectNode.attr('class') == ''){
    //        selectNode.addClass('selectedImg');
    //        Correct.pathDem2 = [];
    //        Correct.pathDem2.push($(e.target).attr('data-path'));
    //    }
    //})
    //
    //$('#tabul_selectDem2').on('click','div',function(e){
    //    $(e.target).removeClass('selectedImg');
    //    Correct.pathDem2.remove(Correct.pathDem2.indexOf($(e.target).next().children('img').attr('data-path')))
    //});

    $('#confirmDem').click(function () {
        var input = {"req.type": "OpenImage", "filepath": Correct.pathDem[0]};
        updateMap(input, "rightcontent");
        window.parent.$('#selectDem').bPopup().close();
    })

    $('#confirmDem2').click(function () {
        var input = {"req.type": "OpenImage", "filepath": Correct.pathDem2[0]};
        updateMap(input, "leftcontent");
        window.parent.$('#selectDem2').bPopup().close();
    })

    $('#executeAlg').click(function () {
        var demPath = Correct.pathDem[0];
        var imgPath = Correct.pathDem2[0];
        var outputPath = Correct.resutltPath = imgPath.replace('zysh\\qianshi', 'process\\demmatch_demo');

        var param = Correct.getParam(demPath, imgPath, outputPath);
        getDemResult(param);
    })
    // 进度条
    $(".taskButton").click(function () {
        $(".taskDetail").toggle();
        if ($(".taskDetail").is(":hidden")) {
            $(".arrow").css("transform", "rotate(0deg)");
        }
        else
            $(".arrow").css("transform", "rotate(-90deg)");
    });

    $('.cancelTask.right').click(function(){
        $.get('http://'+ configInfo.serverIp +':8085/PTRServer/killJob/?jobID=' + Correct.jobID,function(data){
            if(JSON.parse(data).result == 'ok') {
                alert("取消成功");
                window.parent.$('.taskContainer').bPopup().close();
            }else{
                alert('qu')
            }
        })
    })
})

function getDemResult(param) {
    $.post('http://'+ configInfo.serverIp +':8085/PTRServer/submitJob/', JSON.stringify(param), function (data) {
        $('.taskContainer').bPopup({
            speed: 650,
            closeClass: 'close1',
            follow: [true, false],
            escClose: false,
            modalClose: false,
            transitionClose: 'slideBack'
        });
        var taskName = [];
        var percent = [];
        var percentMain = 0;
        CreateSubtask(taskName, percent);
        mainTask(percentMain);
        Correct.jobID = JSON.parse(data).jobID;
        _getStatus(data);
        Correct.process = window.setInterval(_getStatus(data), 1500);
    })
}

function _getStatus(_data) {
    return function () {
        getStatus(_data);
    }
}
function getStatus(data) {
    $.get('http://'+ configInfo.serverIp +':8085/PTRServer/getRunInfo?jobID=' + JSON.parse(data).jobID, function (satusDate) {
        var satusDate =  JSON.parse(satusDate);
        var percentMain = 100 * satusDate.m_percent;
        mainTask(percentMain);
        var taskName = [];
        var percent = [];
        $.get('http://'+ configInfo.serverIp +':8085/PTRServer/getDetailInfo/?jobID=' + JSON.parse(data).jobID, function(detailData){
            var detailData = JSON.parse(detailData);
            for(var keyname in detailData){
                taskName.push(keyname);
                percent.push(parseInt(detailData[keyname] * 100));
                CreateSubtask(taskName, percent);
            }
        })
        var status =satusDate.m_status;
        if (status.toString() == "1") {
            console.log('正在运行');
        } else if (status.toString() == "2") {
            console.log('等待');
        } else if (status.toString() == "3") {
            console.log('成功');
            clearInterval(Correct.process);
            window.parent.$('.taskContainer').bPopup().close();
            var input = {"req.type": "OpenImage", "filepath": Correct.resutltPath};
            updateMap(input, "bottomcontent");
        } else if (status.toString() == "4") {
            console.log('失败');
        }
    })
}
function setJpages(name) {
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

function setImgUl(dirname, ulid) {
    var parm = '{"path":"\\\\public\\\\' + dirname + '","type":["tif"]}';
    $.post('http://'+ configInfo.serverIp +':8081/fsServer/fileMetaInfo/', parm, function (data) {
        var imgdata = JSON.parse(data)['tif'];
        var imgString = '';
        for (var i = 0; i < imgdata.length; i++) {
            var imgUrl = 'http://'+ configInfo.serverIp +':8081/fsServer/thumbnail/?path=' + imgdata[i].path + '.thumb.jpg';
            var imgPath = imgdata[i].path.slice(0, imgdata[i].path.length - 3) + 'tif';
            imgString += '<li><a><img onerror="this.src=\'' + imgUrl + '\'" data-path="' + imgPath + '" src="' + imgUrl + '"><span>' + imgdata[i].name + '</span></a></li>';
        }
        $('#tabul_' + ulid).html(imgString);
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


function mainTask(percentMain) {
    $("progress").val(percentMain);
    $('#processText').attr("data-value", percentMain).css("width", percentMain + "%");
}

//x,y 坐标,radius 半径,process 百分比,backColor 中心颜色, proColor 进度颜色, fontColor 中心文字颜色
function DrowProcess(x, y, radius, taskName, process, backColor, proColor, fontColor) {
    var canvas = document.getElementById('subTask');

    if (canvas.getContext) {
        var cts = canvas.getContext('2d');
    } else {
        return;
    }

    cts.beginPath();
    // 坐标移动到圆心
    cts.moveTo(x, y);
    // 画圆,圆心是24,24,半径24,从角度0开始,画到2PI结束,最后一个参数是方向顺时针还是逆时针
    cts.arc(x, y, radius, 0, Math.PI * 2, false);
    cts.closePath();
    // 填充颜色
    cts.fillStyle = backColor;
    cts.fill();

    cts.beginPath();
    // 画扇形的时候这步很重要,画笔不在圆心画出来的不是扇形
    cts.moveTo(x, y);
    // 跟上面的圆唯一的区别在这里,不画满圆,画个扇形
    cts.arc(x, y, radius, Math.PI * 1.5, Math.PI * 1.5 - Math.PI * 2 * process / 100, true);
    cts.closePath();
    cts.fillStyle = proColor;
    cts.fill();

    //填充背景白色
    cts.beginPath();
    cts.moveTo(x, y);
    cts.arc(x, y, radius - (radius * 0.26), 0, Math.PI * 2, true);
    cts.closePath();
    cts.fillStyle = 'rgba(255,255,255,1)';
    cts.fill();

    // 画一条线
    cts.beginPath();
    cts.arc(x, y, radius - (radius * 0.30), 0, Math.PI * 2, true);
    cts.closePath();
    // 与画实心圆的区别,fill是填充,stroke是画线
    cts.strokeStyle = backColor;
    cts.stroke();

    //在中间写字
    cts.font = "bold 9pt Arial";
    cts.fillStyle = fontColor;
    cts.textAlign = 'center';
    cts.textBaseline = 'middle';
    cts.moveTo(x, y);
    cts.fillText(process + "%", x, y);

    //在上方写任务名
    cts.font = "bold 10pt Arial";
    cts.fillStyle = fontColor;
    cts.textAlign = 'center';
    cts.textBaseline = 'middle';
    cts.moveTo(x, y + 50);
    cts.fillText(taskName, x, y + 50);

}

function CreateSubtask(taskName, percent) {
    var row = parseInt(taskName.length / 6) + 1;
    var canvas = document.getElementById('subTask');
    canvas.height = 100 * row + 20;
    var x = -27, y = 50;  //圆心初始值
    var taskNum = taskName.length;  //任务数
    for (var i = 0; i < 6; i++) {

        for (var j = 0; j < 6; j++)   //x逐渐加120px
        {
            x = x + 100;
            if ((i * 6 + j) < taskNum)
                DrowProcess(x, y, 40, taskName[i * 6 + j], percent[i * 6 + j], '#ddd', '#6495ED', '#0395e8');
        }
        x = -27;  //换行后，x回到60px
        y = y + 100;
    }

}