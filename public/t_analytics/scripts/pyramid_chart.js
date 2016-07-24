$(document).ready(function () {
  pyramid_chart_creater(
    {
      //label : "年代",
      data : ["10代","20代","30代","40代","50代","60代"]
      //data : [ "0-9", "10-19", "20-29", "30-39", "40-49", "50-59", "60-69", "70-79", "80-89", "90-99", "100+" ]
    },
    {
      label : "男性",
      data : [ 8, 18, 35, 51, 53 ,36 ]
      //data : [ 8, 18, 35, 71, 53, 54, 36, 21, 15, 8, 6 ]
    },
    {
      label : "女性",
      data : [ 12, 23, 42, 51, 45 ,34]
      //data : [ 12, 23, 42, 51, 45, 34, 16, 12, 10, 9, 5 ]
    },
    function (data_arrays,ticks_obj,seriesIndex, pointIndex) {
      // show tooltips
      var series_name = data_arrays[seriesIndex].label;
      var ticks_name = ticks_obj.data[pointIndex];
      var series_value = data_arrays[seriesIndex].data[pointIndex];
      return series_name+','+ticks_name+' : '+series_value + '人'
      //$("#tooltipMale").stop(true, true).fadeIn(250).html(malePopulation.toPrecision(4));
      //console.log(series_name);
      //console.log(ticks_name);
      //console.log(series_value);
      //tooltipContentEditor(series_name+','+ticks_name+':'+series_value)
    },
    function () {
      // dismiss tooltips
      //$(".tooltip-item").stop(true, true).fadeOut(200).html('');
    }
  )
})

var pyramid_chart_creater = function(ticks_obj, data1_obj, data2_obj ,callback_highlight, callback_unhighlight) {
    var data_arrays = [data1_obj,data2_obj];
    var tooltipOffset = 20-ticks_obj.data.length > 2 ? 20-ticks_obj.data.length : 2;
    var plot1 = jQuery . jqplot(
        'jqPlot-sample',
        [
          data_arrays[0].data,
          data_arrays[1].data
        ],
        {
            title: '<div style="float: left; width: 50%; text-align: center;">'+data_arrays[0].label+'</div><div style="float: right; width: 50%; text-align: center;">'+data_arrays[1].label+'</div>',
            seriesColors: ["#4bb2c5","#f2b39b"],

            seriesDefaults: {
                renderer: jQuery . jqplot . PyramidRenderer,
                rendererOptions: {
                    barPadding: 4,
                    varyBarColor : false
                },
                yaxis: "yaxis",
                shadow: false
            },
            highlighter: {
              show : true,
              showMarker : false,
              useAxesFormatters : true,
              tooltipLocation : 'n',
              tooltipOffset : tooltipOffset,
              //tooltipFadeSpeed : "def",
              tooltipContentEditor : function(str, seriesIndex, pointIndex){
                        //var splitted = plot._plotData[1][index];
                        //var x = splitted[0];
                        //var y = splitted[1];
                        //return x + ", " + y;
                        //var series_name = data_arrays[seriesIndex].label;
                        //var ticks_name = ticks_obj.data[pointIndex];
                        //var series_value = data_arrays[seriesIndex].data[pointIndex];
                        //return seriesIndex + ":" + pointIndex
                        //return series_name+','+ticks_name+' : '+series_value
                        return callback_highlight(data_arrays,ticks_obj,seriesIndex, pointIndex)
                    }
              //tooltipFormatString: '%d'
              //sizeAdjust: 0.01
            },
            series: [
                {
                    rendererOptions:{
                        side: 'left',
                    }
                },
                {
                    yaxis: "y2axis",
                }
            ],
            grid: {
                drawBorder: true,
                shadow: false,
                background: "rgba(0,0,0,0.0)"
            },
            axes: {
                xaxis: {
                    rendererOptions: {
                        baselineWidth: 2
                    }
                },
                yaxis: {
                    label: ticks_obj.label,
                    labelRenderer: jQuery . jqplot . CanvasAxisLabelRenderer,
                    showMinorTicks: true,
                    ticks: ticks_obj.data,
                    rendererOptions: {
                        category: true,
                        baselineWidth: 2
                    }
                },
                y2axis: {
                    label: ticks_obj.label,
                    labelRenderer: jQuery . jqplot . CanvasAxisLabelRenderer,
                    showMinorTicks: true,
                    ticks: ticks_obj.data,
                    rendererOptions: {
                        category: true,
                        baselineWidth: 2
                    }
                }
            }
        }
    );
    // auto resize
    $(window).resize(function() {
      plot1.replot( { resetAxes: true } );
    });
    // for tips
    $("#jqPlot-sample").bind("jqplotDataHighlight", function(evt, seriesIndex, pointIndex, data){
      //console.log(evt);
      var series_name = data_arrays[seriesIndex].label;
      var ticks_name = ticks_obj.data[pointIndex];
      var series_value = data_arrays[seriesIndex].data[pointIndex];
      //console.log(series_name);
      //console.log(ticks_name);
      //console.log(series_value);
      //setInterval(function () {
        //$("#jqPlot-sample .jqplot-highlighter-tooltip").html(series_name+','+ticks_name+':'+series_value)
      //}, 10);
      if (callback_highlight) callback_highlight(data_arrays,ticks_obj,seriesIndex, pointIndex);
      //tooltipContentEditor(ticks_obj.data[pointIndex] + ':' + data_arrays[seriesIndex][pointIndex])
      //console.log(ticks_obj.data[pointIndex]);
      //console.log(data_arrays[seriesIndex][pointIndex]);
      //console.log(data);
    });
    $("#jqPlot-sample").bind("jqplotDataUnhighlight", function(evt, seriesIndex, pointIndex, data) {
        // clear out all the tooltips.
        //$(".tooltip-item").stop(true, true).fadeOut(200).html('');
        //console.log(evt);
        //console.log(data);
        if (callback_unhighlight) callback_unhighlight();
    });
}
