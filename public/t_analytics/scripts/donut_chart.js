// Get context with jQuery - using jQuery's .get() method.
$(document).ready(function(){
  var donut_data = [
    {
      label : "一ヶ月",
      value : 90
    },
    {
      value: 60,
      label: "三ヶ月"
    },
    {
      value: 30,
      label: "六ヶ月"
    },
    {
      value: 20,
      label: "一年"
    },
    {
      value: 10,
      label: "一年以上"
    }
  ]
  create_donut_charjs("#donut_chart",donut_data,"人")
})


var create_donut_charjs = function (canvas_id,donut_data,ending) {
  var pieChartCanvas = $(canvas_id).get(0).getContext("2d");
  var pieChart = new Chart(pieChartCanvas);

  var color_series = ["#f56954","#00a65a","#f39c12","#00c0ef","#3c8dbc", "#d2d6de"]
  var color_highlight_series = ["#ff836e","#1ac074","#ffb62c","#1adaff","#56a7d6", "#ecf0f8"]

  if(!ending) ending = ""
  for (var i = 0; i < donut_data.length; i++) {
    if(!donut_data[i].color) donut_data[i].color = color_series[i]
    if(!donut_data[i].highlight) donut_data[i].highlight = color_highlight_series[i]
  }

  var PieData = donut_data;

  var pieOptions = {
    //Boolean - Whether we should show a stroke on each segment
    segmentShowStroke: true,
    //String - The colour of each segment stroke
    segmentStrokeColor: "#fff",
    //Number - The width of each segment stroke
    segmentStrokeWidth: 1,
    //Number - The percentage of the chart that we cut out of the middle
    percentageInnerCutout: 50, // This is 0 for Pie charts
    //Number - Amount of animation steps
    animationSteps: 100,
    //String - Animation easing effect
    animationEasing: "easeOutBounce",
    //Boolean - Whether we animate the rotation of the Doughnut
    animateRotate: true,
    //Boolean - Whether we animate scaling the Doughnut from the centre
    animateScale: false,
    //Boolean - whether to make the chart responsive to window resizing
    responsive: true,
    // Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
    maintainAspectRatio: false,
    //String - A legend template
    legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>",
    //String - A tooltip template
    tooltipTemplate: "<%=label%> : <%=value %>"+ending,
    tooltipFillColor: "rgba(0,0,0,0.4)",
  };
  //Create pie or douhnut chart
  // You can switch between pie and douhnut using the method below.
  pieChart.Doughnut(PieData, pieOptions);

  // rewrite labels
  $(canvas_id+"_legend").empty();
  for (var i = (donut_data.length - 1); i >= 0; i--) {
    $(canvas_id+"_legend").append(
      "<li>"+'<i class="fa fa-circle-o" style="color:'+color_series[i]+'"></i> '+
      donut_data[i].label+"</li>"
    )
  }
}

//-----------------
//- END PIE CHART -
//-----------------
