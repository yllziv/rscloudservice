
(function($){
    $.fn.drawPie = function(color,num){
        var myColors = [color,"#E7E7E7"];
        /*E7E7E7,FE7E7F,76C8BC*/
        d3.scale.myColors = function() {
            return d3.scale.ordinal().range(myColors);
        };
        var width = 150;
        var a = num;
        var dataset = [];
        dataset.push(a);
        dataset.push(1-a);

        var pie = d3.layout.pie();
        var piedata = pie(dataset);
        var outerRadius = 55;
        var innerRadius = 50;
        var arc = d3.svg.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius);
        var svg = d3.select("#"+this.attr("id")).append("svg").attr("width",width).attr("height",width);
//        var color = myColors;//十种颜色的比例尺
        var arcs =svg.selectAll("g")
            .data(piedata)
            .enter()
            .append("g")
            .attr("transform","translate("+(width/2)+","+(width/2)+")");
        arcs.append("path")
            .attr("fill",function(d,i){
                return myColors[i];
            })
            .attr("d",function(d){
                return arc(d);//弧生成器
            });
    }
}(jQuery));
$('#pie1').drawPie("#67B4EA",0.25);
$('#pie2').drawPie("#FE7E7F",0.20);
$('#pie3').drawPie("#76C8BC",0.67);
//drawTable
var LogArray = [{"a":"a","b":1,"c":"c","d":4},{"a":"a","b":1,"c":"c","d":4},{"a":"a","b":1,"c":"c","d":4},{"a":"a","b":1,"c":"c","d":4},{"a":"a","b":1,"c":"c","d":4},{"a":"a","b":1,"c":"c","d":4},{"a":"a","b":1,"c":"c","d":4}];
var addhtml = "";
for ( var i= 0; i < LogArray.length; i++) {
    addhtml += "<tr><td>"+LogArray[i].a+
        "</td><td>"+LogArray[i].b+
        "</td><td>"+LogArray[i].c+
        "</td><td>"+LogArray[i].d+"</td></tr>";
}
$('tbody').append(addhtml);

new TableSorter("tb1");