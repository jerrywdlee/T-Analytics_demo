var age_groups,items,follow_up_triggers,auto_order_triggers;
$(document).ready(function() {

  init_input_space("sexes",function (data) {
    var select = $("select.sexes")
    select.empty()
    select.append('<option value="" disabled selected>性別</option>')
    for(var i in data){
      select.append('<option value="'+data[i].id+'">'+data[i].sex+'</option>')
    }
  })

  init_input_space("ranks",function (data) {
    var select = $("select.ranks")
    select.empty()
    select.append('<option value="" disabled selected>ランク</option>')
    for(var i in data){
      select.append('<option value="'+data[i].id+'">'+data[i].rank+'</option>')
    }
  })

  init_input_space("device_statuses",function (data) {
    var select = $("select.device_statuses")
    select.empty()
    select.append('<option value="" disabled selected>端末状況</option>')
    for(var i in data){
      select.append('<option value="'+data[i].id+'">'+data[i].device_status+'</option>')
    }
  })

  init_input_space("age_groups",function (data) {
    var select = $("select.age_groups")
    select.empty()
    select.append('<option value="" disabled selected>年代</option>')
    age_groups = data
    for(var i in data){
      select.append('<option value="'+data[i].id+'">'+data[i].age_group+'</option>')
    }
  })

  init_input_space("auto_order_triggers",function (data) {
    var select = $("select.auto_order_triggers")
    select.empty()
    select.append('<option value="" disabled selected>自動注文トリガー</option>')
    auto_order_triggers = data
    for(var i in data){
      select.append('<option value="'+data[i].id+'">'
                  + data[i].param_1_name
                  + " " + data[i].condition_name + " "
                  + data[i].param_2_name
                  + '</option>')
    }
  })

  init_input_space("follow_up_triggers",function (data) {
    var select = $("select.follow_up_triggers")
    select.empty()
    select.append('<option value="" disabled selected>フォローアップトリガー</option>')
    follow_up_triggers = data
    for(var i in data){
      select.append('<option value="'+data[i].id+'">'
                  + data[i].param_1_name
                  + " " + data[i].condition_name + " "
                  + data[i].param_2_name
                  + '</option>')
    }
  })

  init_input_space("items",function (data) {
    var select = $("select.items")
    select.empty()
    select.append('<option value="" disabled selected>商品名 (商品番号)</option>')
    items = data
    for(var i in data){
      select.append('<option value="'+data[i].id+'">'
                    + data[i].item_name
                    + ' ( ' +data[i].item_code+' )'
                    + '</option>')
    }
  })

})

function init_input_space(table_name,call_back) {
  //var table_name = "devices"
  $.get("/ajax/init_input?table_name="+table_name,function (data,status) {
    //console.log(data);
    call_back(data);
  })
}
