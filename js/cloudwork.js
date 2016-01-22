$(document).ready(function () {
    var url = window.location.search.slice(1,window.location.search.length);
    $('.intoCloudWork').click(function(){
        createIframe(url);
    })
})

function createIframe(name) {
    $.get('http://'+ configInfo.serverIp +':8082/openstack/getConsoleUrl?name=' + name, function (data) {
        window.open('../instance.html?' + data);
    })
}