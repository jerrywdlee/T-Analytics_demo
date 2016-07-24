$(document).ready(function(){
  var morris_plot_data = [
    {y: '2016-01', item1:31, item2:null },
    {y: '2016-02', item1:28, item2:25 },
    {y: '2016-03', item1:31, item2:35 },
    {y: '2016-04', item1:30, item2:35 },
    {y: '2016-05', item1:31, item2:35 },
    {y: '2016-06', item1:30, item2:20 },
  ]
  var morris_plot_labels = ['おすすめ','あなた']
  var morris_plot_color = ['yellow','#efefef']
  create_plot_chart_morris('line-chart',morris_plot_data,morris_plot_labels,morris_plot_color)
})

function create_plot_chart_morris(div_id,data,labels,colors) {
  var line = new Morris.Line({
    element: div_id,
    resize: true,
    data: data,
    xkey: 'y',
    ykeys: ['item1','item2'],
    yLabelFormat:function (y) { return Math.round(y).toString(); },
    labels: labels,
    lineColors: colors,
    lineWidth: 2,
    hideHover: 'auto',
    hoverCallback: function (index, options, content, row) {
      return(content)
    },
    stacked: true,
    gridTextColor: "#fff",
    gridStrokeWidth: 0.4,
    pointSize: 4,
    pointStrokeColors: colors,
    gridLineColor: "#efefef",
    gridTextFamily: "Open Sans",
    gridTextSize: 10
  });
}
