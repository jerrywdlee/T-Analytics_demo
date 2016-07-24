$(document).ready(function(){
  //var item_A = [[1,50],[2,40],[3,60],[4,70],[5,50],[6,60]]
  //var item_B = [[1,70],[2,50],[3,80],[4,50],[5,40],[6,70]]
  var item_A = {
    label : "商品A",
    // null can set that position no point
    data : [null,65, 59, null, 81, 56, 55]
  }
  var item_B = {
    label: "商品B",
    data: [28, 48, 40, 19, 86, 27, 90]
  }
  var plot_ticks_x = ["2016-01","2016-02","2016-03","2016-04","2016-05","2016-06","2016-07"]
  create_plot_chartjs("#cos_sin",plot_ticks_x,[item_A,item_B])
/*
  var areaChartData2 = {
    //labels: ["January", "February", "March", "April", "May", "June", "July"],
    labels :plot_ticks_x,
    datasets: [
      {
        label: "商品A",
        //backgroundColor: "rgba(75,192,192,0.4)",
        //fillColor: "rgba(210, 214, 222, 1)",
        strokeColor: "rgba(210, 214, 222, 1)",
        pointColor: "rgba(210, 214, 222, 1)",
        //pointStrokeColor: "#c1c7d1",
        pointHighlightFill: "#fff",
        //pointHighlightStroke: "rgba(220,220,220,1)",
        data: [null,65, 59, null, 81, 56, 55]
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
    responsive: true
    //backgroundColor: "rgba(75,192,192,0.4)"
  };

  var lineChartCanvas = $("#cos_sin").get(0).getContext("2d");

  var lineChart = new Chart(lineChartCanvas);
  var lineChartOptions = areaChartOptions2;
  lineChartOptions.datasetFill = false;
  lineChart.Line(areaChartData2, lineChartOptions);
*/
});

var create_plot_chartjs = function (canvas_id, label_series, data_series, color_series) {
  if (!color_series) {
    color_series = ['#00C0EF','#DD4B39','#00A65A','#F39C12','#F2B39B','#D2D6DE','#605CA8','#444444']
  }
  var datasets = []
  console.log();
  for (var i = 0; i < data_series.length; i++) {
    var data_color = data_series[i].color? data_series[i].color : color_series[i]
    var dataset = {
      label : data_series[i].label,
      data : data_series[i].data,
      strokeColor : data_color,
      pointColor : data_color,
      pointHighlightStroke: data_color,
      pointStrokeColor: data_color,
      pointHighlightFill : "#fff"
    }
    //console.log(dataset);
    datasets.push(dataset)
  }
  //console.log(datasets);
  var ChartData = {
    labels :label_series,
    //datasets: datasets
    datasets :datasets
  };
  var ChartOptions = {
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
    responsive: true
    //backgroundColor: "rgba(75,192,192,0.4)"
  };

  var lineChartCanvas = $("#cos_sin").get(0).getContext("2d");
  var lineChart = new Chart(lineChartCanvas);
  ChartOptions.datasetFill = false;
  lineChart.Line(ChartData, ChartOptions);
}
