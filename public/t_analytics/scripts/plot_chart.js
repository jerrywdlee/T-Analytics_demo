$(document).ready(function(){
  // Some simple loops to build up data arrays.
  /*
  var cosPoints = [];
  for (var i=0; i<2*Math.PI; i+=1){
    cosPoints.push([i, Math.cos(i)]);
  }

  var sinPoints = [];
  for (var i=0; i<2*Math.PI; i+=0.4){
     sinPoints.push([i, 2*Math.sin(i-.8)]);
  }

  var powPoints1 = [];
  for (var i=0; i<2*Math.PI; i+=1) {
      powPoints1.push([i, 2.5 + Math.pow(i/4, 2)]);
  }

  var powPoints2 = [];
  for (var i=0; i<2*Math.PI; i+=1) {
      powPoints2.push([i, -2.5 - Math.pow(i/4, 2)]);
  }*/

  // jQuery selector for all divs with a class of "jqplot".
  // Here, there are two divs that match.  By supplying 2 seperate
  // arrays of data, each plot will have its own independent series.
  // Only one options array is supplied, so it will be used for both
  // plots.

  //var item_A = [["2016-01-01",0.5],["2016-02-01",0.4],["2016-03-01",0.6],
  //              ["2016-04-01",0.7],["2016-05-01",0.5],["2016-06-01",0.6]]

  //var item_B = [["2016-01-01",0.7],["2016-02-01",0.5],["2016-03-01",0.8],
  //              ["2016-04-01",0.5],["2016-05-01",0.4],["2016-06-01",0.6]]

  var item_A = [[1,50],[2,40],[3,60],[4,70],[5,50],[6,60]]
  var item_B = [[1,70],[2,50],[3,80],[4,50],[5,40],[6,70]]
  var plot_ticks_x = ["2016-01","2016-02","2016-03","2016-04","2016-05","2016-06","2016-07"]
  /*
  $("#cos_sin").jqplot([cosPoints, sinPoints], {
      //title: "One Selector, Multiple Plots",

      axes:{
        xaxis:{
          //renderer:$.jqplot.DateAxisRenderer,
          //tickOptions:{
            //formatString:'%b&nbsp;%#d'
          //}
          //ticks :plot_ticks_x
        },
        yaxis:{
          tickOptions:{
            formatString:'%.2f%'
            }
        }
      },
      grid: {
            //drawBorder: false,
            shadow: false,
            //background: 'white'
          },
      seriesDefaults: {
          rendererOptions: {
              smooth: true,
              shadow: false
          },
      shadow : false
    },
    legend:{
      show:true,
            //placement: 'outside',
            //rendererOptions: {
              //  numberRows: 1
            //s},
            //location:'s',
            //marginTop: '15px'
    },
    highlighter: {
        show: true,
        sizeAdjust: 7.5
    }
  });

  var line1=[['23-May-08', 578.55], ['20-Jun-08', 566.5], ['25-Jul-08', 480.88], ['22-Aug-08', 509.84],
      ['26-Sep-08', 454.13], ['24-Oct-08', 379.75], ['21-Nov-08', 303], ['26-Dec-08', 308.56],
      ['23-Jan-09', 299.14], ['20-Feb-09', 346.51], ['20-Mar-09', 325.99], ['24-Apr-09', 386.15]];
  /*
  var plot2 = $.jqplot('cos_sin', [line1], {
      title:'Data Point Highlighting',
      axes:{
        xaxis:{
          renderer:$.jqplot.DateAxisRenderer,
          tickOptions:{
            formatString:'%b&nbsp;%#d'
          }
        },
        yaxis:{
          tickOptions:{
            formatString:'$%.2f'
            }
        }
      },
      highlighter: {
        show: true,
        sizeAdjust: 7.5
      },
      cursor: {
        show: false
      }
  });

  $.plot("#cos_sin", [item_A, item_B], {
    grid: {
      hoverable: true,
      borderColor: "#f3f3f3",
      borderWidth: 1,
      tickColor: "#f3f3f3"
    },
    series: {
      shadowSize: 0,
      lines: {
        show: true
      },
      points: {
        show: true
      }
    },
    lines: {
      fill: false,
      color: ["#3c8dbc", "#f56954"]
    },
    yaxis: {
      show: true,
    },
    xaxis: {
      show: true
    }
  });
  */




  var areaChartData2 = {
    //labels: ["January", "February", "March", "April", "May", "June", "July"],
    labels :plot_ticks_x,
    datasets: [
      {
        label: "商品A",
        backgroundColor: "rgba(75,192,192,0.4)",
        fillColor: "rgba(210, 214, 222, 1)",
        strokeColor: "rgba(210, 214, 222, 1)",
        pointColor: "rgba(210, 214, 222, 1)",
        pointStrokeColor: "#c1c7d1",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(220,220,220,1)",
        data: [65, 59, 80, 81, 56, 55, 40]
      },
      {
        label: "商品B",
        backgroundColor: "rgba(75,192,192,0.4)",
        fillColor: "rgba(60,141,188,0.9)",
        strokeColor: "rgba(60,141,188,0.8)",
        pointColor: "#3b8bba",
        pointStrokeColor: "rgba(60,141,188,1)",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(60,141,188,1)",
        data: [28, 48, 40, 19, 86, 27, 90]
      }
    ]
  };

  var areaChartOptions2 = {
    //Boolean - If we should show the scale at all
    showScale: true,
    //scaleOverride : true,
    scaleLabel : "<%=value%>%",
    multiTooltipTemplate: "<%=datasetLabel%> : <%=value%>%",
    tooltipFillColor: "rgba(0,0,0,0.4)",
    //Boolean - Whether grid lines are shown across the chart
    scaleShowGridLines: true,
    scaleLineColor : "rgba(0,0,0,0.4)",
    scaleLineWidth: 2,
    scaleGridLineColor: "rgba(50,50,0,.2)",
    //String - Colour of the grid lines
    //scaleGridLineColor: "rgba(50,50,0,.05)",
    //Number - Width of the grid lines
    scaleGridLineWidth: 1,
    //Boolean - Whether to show horizontal lines (except X axis)
    scaleShowHorizontalLines: true,
    //Boolean - Whether to show vertical lines (except Y axis)
    scaleShowVerticalLines: true,
    //Boolean - Whether the line is curved between points
    bezierCurve: true,
    //Number - Tension of the bezier curve between points
    bezierCurveTension: 0.3,
    //Boolean - Whether to show a dot for each point
    pointDot: true,
    //Number - Radius of each point dot in pixels
    pointDotRadius: 4,
    //Number - Pixel width of point dot stroke
    pointDotStrokeWidth: 1,
    //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
    pointHitDetectionRadius: 20,
    //Boolean - Whether to show a stroke for datasets
    datasetStroke: true,
    //Number - Pixel width of dataset stroke
    datasetStrokeWidth: 2,
    //Boolean - Whether to fill the dataset with a color
    datasetFill: true,
    //String - A legend template
    legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].lineColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>",
    //Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
    maintainAspectRatio: true,
    //Boolean - whether to make the chart responsive to window resizing
    responsive: true,
    backgroundColor: "rgba(75,192,192,0.4)"
  };

  var lineChartCanvas = $("#cos_sin").get(0).getContext("2d");

  var lineChart = new Chart(lineChartCanvas);
  var lineChartOptions = areaChartOptions2;
  lineChartOptions.datasetFill = false;
  lineChart.Line(areaChartData2, lineChartOptions);
});
