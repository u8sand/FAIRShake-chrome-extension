$("head").append('<style type="text/css">#submithere{ display: none;}</style>');
$("head").append('<style type="text/css">div.tooltip {' +
    'position: absolute;' +
    'padding: 2px;' +
    'font: 13px sans-serif;' +
    'background: black;' +
    'color:white;' +
    'border-radius:2px;' +
    'pointer-events: none;' +
    'max-width: 300px;' +
    '}</style>');

$(document).ready(function () {

    var dsURL = window.location.href;

    var finddsDescrip1 = $(".col-md-10.pull-left.ng-binding")[1];
    var finddsName = $(".col-md-10.pull-left.ng-binding")[0];
    var finddsDescrip2 = $("p.ng-binding")[0];

    var dsDescrip2 = $(".tab-pane.row.ng-scope[ng-if='viewData.datasetinfo !=undefined']")
        .find(finddsDescrip2).text();
    var dsDescrip1 = $(".tab-pane.row.ng-scope[ng-if='viewData.datasetinfo !=undefined']")
        .find(finddsDescrip1).text();
    var dsName = $(".tab-pane.row.ng-scope[ng-if='viewData.datasetinfo !=undefined']")
        .find(finddsName).text();

    var dsQ = $.ajax({
        async: false,
        url: 'https://amp.pharm.mssm.edu/fairshake/api/chrome_extension/getQ?',
        data: {
            'theType': 'Dataset'
        },
        success: function (data) {
            return data
        }
    }).responseText;

    var tQuestions = dsQ.split(/u'|u"/);
    // var tQuestions = dsQ.split(/', '|', "|", "|", '/);

    for (i = 0; i <= 16; i++) {
        tQuestions[i] = tQuestions[i].replace(/',|",/g, '');
        tQuestions[i] = tQuestions[i].replace(/']|\['/g, '');
    }

    // tQuestions.unshift('n')


    $.ajax({
        url: 'https://amp.pharm.mssm.edu/fairshake/api/chrome_extension/getAvg?',
        data: {
            'select': 'URL',
            'theURL': dsURL
        },
        success: function (data) {
            if (data === 'None') {
                makeBlankInsig(tQuestions);
            } else {
                makeInsig(data, tQuestions);
            }
        }
    });


    var kokobop = $(".col-md-3").eq(0).find("img");

    $(kokobop).before('<form action="https://amp.pharm.mssm.edu/fairshake/redirectedFromExt" id="insigform" method="POST" target="_blank">'
        + '<input type="hidden" name="theName" value="' + dsName + '">'
        + '<input type="hidden" name="theURL" value="' + dsURL + '">'
        + '<input type="hidden" name="dsDescrip1" value="' + dsDescrip1 + '">'
        + '<input type="hidden" name="dsDescrip2" value="' + dsDescrip2 + '">'
        + '<input type="hidden" name="theType" value="Dataset">'
        + '<input type="hidden" name="theSrc" value="LINCS Data Portal">'
        + '<label id="submitlabel"><input type="submit" id="submithere"/></label></form>');
    $('#insigform').after('<h4 class="ng-binding Imaging" ng-class="viewData.datasetinfo.biologicalbucket.toString()" id="fairLabel">FAIRness<br>Assessment</h4>')

});


function makeInsig(avg, qstns) {

    scale = d3.scaleLinear().domain([-1, 1])
        .interpolate(d3.interpolateRgb)
        .range([d3.rgb(255, 0, 0), d3.rgb(0, 0, 255)]);

    var body = d3.select("#submitlabel").append("svg").attr("width", 40).attr("height", 40);

    body.selectAll("rect.insig").data(getData(avg, qstns)).enter().append("rect").attr("class", "insig")
        .attr("width", 10).attr("height", 10)
        .attr("id", function (d, i) {
            return "insigSq-" + (i + 1)
        })
        .attr("x", function (d) {
            return d.posx;
        }).attr("y", function (d) {
        return d.posy;
    }).style("fill", function (d) {
        return scale(d.numdata);
    })
        .style("stroke", "white").style("stroke-width", 1).style("shape-rendering", "crispEdges");

    body.selectAll("rect.btn").data(getData(avg, qstns)).enter().append("rect").attr("class", "btn").attr("width", 10).attr("height", 10)
        .attr("x", function (d) {
            return d.posx;
        }).attr("y", function (d) {
        return d.posy;
    }).style("fill-opacity", 0)
        .on("mouseover", opac)
        .on("mouseout", bopac)
    ;
}

function makeBlankInsig(qstns) {
    var body = d3.select("#submitlabel").append("svg").attr("width", 40).attr("height", 40);

    body.selectAll("rect.insig").data(getBlankData(qstns)).enter().append("rect").attr("class", "insig")
        .attr("id", function (d, i) {
            return "insigSq-" + (i + 1)
        })
        .attr("width", 10).attr("height", 10)
        .attr("x", function (d) {
            return d.posx;
        }).attr("y", function (d) {
        return d.posy;
    }).style("fill", "darkgray").style("stroke", "white").style("stroke-width", 1).style("shape-rendering", "crispEdges");

    body.selectAll("rect.btn").data(getBlankData(qstns)).enter().append("rect").attr("class", "btn").attr("width", 10).attr("height", 10)
        .attr("x", function (d) {
            return d.posx;
        }).attr("y", function (d) {
        return d.posy;
    }).style("fill-opacity", 0)
        .on("mouseover", opacBlank)
        .on("mouseout", bopac)
    ;
}

function getData(avg, qstns) {

    var avgAns = avg.split(",");

    return [{numdata: avgAns[0], qdata: "1. " + qstns[1], posx: 0, posy: 0},
        {numdata: avgAns[1], qdata: "2. " + qstns[2], posx: 10, posy: 0},
        {numdata: avgAns[2], qdata: "3. " + qstns[3], posx: 20, posy: 0},
        {numdata: avgAns[3], qdata: "4. " + qstns[4], posx: 30, posy: 0},
        {numdata: avgAns[4], qdata: "5. " + qstns[5], posx: 0, posy: 10},
        {numdata: avgAns[5], qdata: "6. " + qstns[6], posx: 10, posy: 10},
        {numdata: avgAns[6], qdata: "7. " + qstns[7], posx: 20, posy: 10},
        {numdata: avgAns[7], qdata: "8. " + qstns[8], posx: 30, posy: 10},
        {numdata: avgAns[8], qdata: "9. " + qstns[9], posx: 0, posy: 20},
        {numdata: avgAns[9], qdata: "10. " + qstns[10], posx: 10, posy: 20},
        {numdata: avgAns[10], qdata: "11. " + qstns[11], posx: 20, posy: 20},
        {numdata: avgAns[11], qdata: "12. " + qstns[12], posx: 30, posy: 20},
        {numdata: avgAns[12], qdata: "13. " + qstns[13], posx: 0, posy: 30},
        {numdata: avgAns[13], qdata: "14. " + qstns[14], posx: 10, posy: 30},
        {numdata: avgAns[14], qdata: "15. " + qstns[15], posx: 20, posy: 30},
        {numdata: avgAns[15], qdata: "16. " + qstns[16], posx: 30, posy: 30}


    ]

}

function getBlankData(qstns) {

    return [{qdata: "1. " + qstns[1], posx: 0, posy: 0},
        {qdata: "2. " + qstns[2], posx: 10, posy: 0},
        {qdata: "3. " + qstns[3], posx: 20, posy: 0},
        {qdata: "4. " + qstns[4], posx: 30, posy: 0},
        {qdata: "5. " + qstns[5], posx: 0, posy: 10},
        {qdata: "6. " + qstns[6], posx: 10, posy: 10},
        {qdata: "7. " + qstns[7], posx: 20, posy: 10},
        {qdata: "8. " + qstns[8], posx: 30, posy: 10},
        {qdata: "9. " + qstns[9], posx: 0, posy: 20},
        {qdata: "10. " + qstns[10], posx: 10, posy: 20},
        {qdata: "11. " + qstns[11], posx: 20, posy: 20},
        {qdata: "12. " + qstns[12], posx: 30, posy: 20},
        {qdata: "13. " + qstns[13], posx: 0, posy: 30},
        {qdata: "14. " + qstns[14], posx: 10, posy: 30},
        {qdata: "15. " + qstns[15], posx: 20, posy: 30},
        {qdata: "16. " + qstns[16], posx: 30, posy: 30}]
}


function roundTwo(num) {
    return +(Math.round(num + "e+2") + "e-2");
}

function opac(d, i) {
    d3.select("#insigSq-" + (i + 1)).style("fill-opacity", .3);
    var div = d3.select(this.parentNode.parentNode.parentNode.parentNode.parentNode).append("div")
        .attr("class", "tooltip").attr("id","fairtt").style("opacity", 0);

    div.transition().style("opacity", .8);
    div.html("Score: " + roundTwo(d.numdata) + "<br>" + d.qdata)
        .style("left", (d3.event.pageX + 10) + "px")
        .style("top", (d3.event.pageY - 28) + "px");
}

function opacBlank(d, i) {
    d3.select("#insigSq-" + (i + 1)).style("fill-opacity", .3);
    var div = d3.select(this.parentNode.parentNode.parentNode.parentNode.parentNode).append("div")
        .attr("class", "tooltip").attr("id","fairtt").style("opacity", 0);

    div.transition().style("opacity", .8);
    div.html("Score: " + "N/A" + "<br>" + d.qdata)
        .style("left", (d3.event.pageX + 10) + "px")
        .style("top", (d3.event.pageY - 28) + "px");
}

function bopac(d, i) {
    d3.select("#insigSq-" + (i + 1)).style("fill-opacity", 1);
    d3.selectAll("#fairtt").remove();
}