var devices_data
$(document).ready(function() {
  //var table = create_datatables ("example1", "t_analytics/data/arrays.json")
  //create_datatables ("example2", "/ajax/show_devices")

  $.get("/ajax/show_devices",function (data,status) {
    //console.log(data);
    var dataSet = []
    devices_data = data
    for (var i in data) {
      var d = new Date(data[i].updated_at)
      var time_str = d.toLocaleString();
      dataSet.push([
        data[i].uuid,
        '<a data-toggle="tooltip" title="'+ data[i].uuid
        + '" href="javascript:show_device('+data[i].id+')" >'
        + data[i].uuid.slice(0,7)+'...</a>',
        '<a href="javascript:show_item('+data[i].item_id+')" >'+data[i].item_name+'</a>',
        '<a href="javascript:show_custom('+data[i].id+')">'+data[i].name+'</a>',
        data[i].rank,
        data[i].device_status,
        data[i].remain_lvl,
        data[i].ot_p1n
        + " " + data[i].ot_cn + " "
        + data[i].ot_p2n,
        '<i class="fa fa-battery-'+data[i].battery_lvl+'">'
        + '<span style="display:none">'
        + 'battery='+data[i].battery_lvl
        +'</span></i>',
        time_str
      ])
    }
    var columnNames = [
      {title:"FULL UUID"},
      {title:"UUID"},
      {title:"商品名"},
      {title:"顧客"},
      {title:"ランク"},
      {title:"使用状況"},
      {title:"商品残量"},
      {title:"自動注文条件"},
      {title:"電池"},
      {title:"最終更新日"}
    ]
    //console.log(dataSet);
    create_datatables_bydata("example1",dataSet,columnNames)
  })

});

function show_item(id) {
  alert(id)
}

function show_device(id) {
  var device = devices_data.filter(function (device) {
    return device.id == id;
  })
  console.log(device[0]);
  set_device_from_table(device[0])
}

var create_datatables_bydata = function (table_id,dataSet,columnNames) {
  var table = $('#'+table_id).DataTable( {
    //"ajax": ajax_url,
    data: dataSet,
    columns:columnNames,
    "language": {
        "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Japanese.json"
    },
    "order": [[ 9, "desc" ]],
    stateSave: true,
    "columnDefs": [
      {
        //"render": function ( data, type, row ) {
        //  return data //+' $';
        //},
        "visible": false,
        "targets": 0
      },
      {
          "targets": [ 2 ],
          "visible": true,
          "searchable": true
      },
      {
        "targets": [ 6 ],
        "render": function ( data, type, row ) {
          return data +'%';
        }
      },
      {
          "targets": [ 7 ],
          "visible": true,
          //"searchable": false
      }
    ],
    //"scrollX": true,
    scrollCollapse: true
  } );
  // hover highlight
  $('#'+table_id+' tbody').on( 'mouseenter', 'td', function () {
    try {
      var colIdx = table.cell(this).index().row;
      //console.log(colIdx)
      $( table.rows().nodes() ).removeClass( 'highlight' ).css({"background-color": ""});
      $( table.rows( colIdx ).nodes() ).addClass( 'highlight' ).css({"background-color": "#FFFDF0"});
    } catch (e) {}
  });
  $('#'+table_id+' tbody').on('mouseleave','td',function(){
    $( table.rows().nodes() ).removeClass( 'highlight' ).css({"background-color": ""});
  })
  return table

}


var create_datatables = function (table_id, dataSet,columnNames) {
  var table = $('#'+table_id).DataTable( {
    "ajax": ajax_url,
    "language": {
        "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Japanese.json"
    },
    "order": [[ 4, "desc" ]],
    stateSave: true,
    "columnDefs": [
      {
        "render": function ( data, type, row ) {
          return data +' $';
        },
        "targets": 0
      },
      {
          "targets": [ 2 ],
          "visible": true,
          "searchable": true
      },
      {
          "targets": [ 3 ],
          "visible": false
      }
    ],
    "scrollX": true,
    //scrollY:        '60vh',
    //scrollY:        '300px',
    //scrollCollapse: true
    /*独立検索欄
    initComplete: function () {
            this.api().columns().every( function () {
                var column = this;
                var select = $('<input type="text" />')
                    .appendTo( $(column.footer()).empty() )
                    .on( 'keyup change', function () {
                        var val = $(this).val()
                        console.log(val);
                        column.search(val).draw()
                        //column.search( val ? '^'+val+'$' : '', true, false ).draw();
                    } );

                //column.data().unique().sort().each( function ( d, j ) {
                //    select.append( '<option value="'+d+'">'+d+'</option>' )
                //} );
            } );
        }
    */
    //"dom": 'lf<"toolbar">rtip',
    //initComplete:function () {
    //  $(".toolbar").html('<button onclick="state_clear()">clear</button>');
    //}


  } );
  //table.state.clear();
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
