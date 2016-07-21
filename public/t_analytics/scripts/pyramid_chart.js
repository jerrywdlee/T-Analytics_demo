$(document).ready(function () {
  pyramid_chart_creater(
    {
      label : "年代",
      data : [ "0-9", "10-19", "20-29", "30-39", "40-49", "50-59", "60-69", "70-79", "80-89", "90-99", "100+" ]
    },
    {
      label : "男性",
      data : [ 8, 18, 35, 71, 53, 54, 36, 21, 15, 8, 6 ]
    },
    {
      label : "女性",
      data : [ 12, 23, 42, 51, 45, 34, 16, 12, 10, 9, 5 ]
    },
    function (data_arrays,ticks_obj,seriesIndex, pointIndex) {
      // show tooltips
      var series_name = data_arrays[seriesIndex].label;
      var ticks_name = ticks_obj.data[pointIndex];
      var series_value = data_arrays[seriesIndex].data[pointIndex];
      //$("#tooltipMale").stop(true, true).fadeIn(250).html(malePopulation.toPrecision(4));
      console.log(series_name);
      console.log(ticks_name);
      console.log(series_value);
    },
    function () {
      // dismiss tooltips
      //$(".tooltip-item").stop(true, true).fadeOut(200).html('');
    }
  )
})

var pyramid_chart_creater = function(ticks_obj, data1_obj, data2_obj ,callback_highlight, callback_unhighlight) {
    var data_arrays = [data1_obj,data2_obj]
    var plot1 = jQuery . jqplot(
        'jqPlot-sample',
        [
          data_arrays[0].data,
          data_arrays[1].data
        ],
        {
            title: '<div style="float: left; width: 50%; text-align: center;">'+data_arrays[0].label+'</div><div style="float: right; width: 50%; text-align: center;">'+data_arrays[1].label+'</div>',
            seriesDefaults: {
                renderer: jQuery . jqplot . PyramidRenderer,
                rendererOptions: {
                    barPadding: 4
                },
                yaxis: "yaxis",
                shadow: false
            },
            highlighter: {
              show: true,
              sizeAdjust: 7.5
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
      if (callback_highlight) callback_highlight(data_arrays,ticks_obj,seriesIndex, pointIndex);
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
