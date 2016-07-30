var columnNames = [
  {title:"FULL UUID", "data": "uuid" },
  {title:"UUID", "data": "uuid" },
  {title:"顧客", "data": "name"},
  {title:"商品残量", "data": "remain_lvl"},
  {title:"電池", "data": "battery_lvl"},
  {title:"Opened?", "data": "opened"},
  {title:"記録時刻", "data": "updated_at"},
  {title:"Raw Data", "data": "raw_data"},
]
var datatables_test_send
$(document).ready(function() {
  datatables_test_send = create_datatables_ajax('datatables_test_send','/ajax/advanced_raw_datas',columnNames)
})



var create_datatables_ajax = function (table_id, ajax_url,columnNames) {
  var table = $('#'+table_id).DataTable( {
    "ajax": ajax_url,
    columns:columnNames,
    "language": {
        "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Japanese.json"
    },
    "order": [[ 6, "desc" ]],
    //stateSave: true,
    "columnDefs": [
      {
        "targets": [ 0 ],
        "visible": false
      },
      {
        "render": function ( data, type, row ) {
          return "<a data-toggle='tooltip' title='"+ data +"'>"+ data.slice(0,6) +'...</a>';
        },
        "targets": [1]
      },
      {
        "targets": [ 3 ],
        "searchable": true,
        "render" : function (data,type,row) {
          return data +"%"
        }
      },
      {
        "targets" : [4],
        "render" : function (data,type,row) {
          var battery_lvl = '<i class="fa fa-battery-'+data+'">'
                          + '<span style="display:none">'
                          + 'battery='+data +'</span></i>'
          return battery_lvl
        }
      },
      {
        "targets" : 7,
        "render" : function (data , type, row) {
          return "<a href='javascript:alert("+ JSON.stringify(data) +")'>"+ data.slice(0,15) +'...</a>';
        }
      }

    ],
    //"scrollX": true,
    scrollY:        '40vh',
    //scrollY:        '300px',
    scrollCollapse: true

  } );
  // hover highlight
  $('#'+table_id+' tbody').on( 'mouseenter', 'td', function () {
    try {
      var colIdx = table.cell(this).index().row;
      //console.log(colIdx)
      $( table.rows().nodes() ).removeClass( 'highlight' ).css({"background-color": ""});
      $( table.rows( colIdx ).nodes() ).addClass( 'highlight' ).css({"background-color": "#FFFDF0"});
    } catch (e) {

    }
  });
  $('#'+table_id+' tbody').on('mouseleave','td',function(){
    $( table.rows().nodes() ).removeClass( 'highlight' ).css({"background-color": ""});
  })
  table.on( 'xhr', function () {
    var json = table.ajax.json();
    //console.log(json.data);
    //alert( json.data.length +' row(s) were loaded' );
} );
  /*
  $('#'+table_id).on("click",".toolbar button",function () {
    console.log("aaa");
    table.state.clear();
    window.location.reload();
    table.draw()
  })*/
  return table
}
