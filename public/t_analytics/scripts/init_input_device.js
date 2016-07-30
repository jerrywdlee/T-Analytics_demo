var age_groups,items,follow_up_triggers,auto_order_triggers,customers,devices;
$(document).ready(function() {
  if ($("select.sexes").length) {
    init_input_space("sexes",function (data) {
      var select = $("select.sexes")
      select.empty()
      select.append('<option value="" disabled selected>性別</option>')
      for(var i in data){
        select.append('<option value="'+data[i].id+'">'+data[i].sex+'</option>')
      }
    })
  }

  if ($("select.ranks").length || $("select.device_statuses").length || $("select.age_groups").length) {
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

  }

  if ($("select.auto_order_triggers").length) {
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
  }

  if ($("select.follow_up_triggers").length) {
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
  }

  if ($("select.items").length) {
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
  }

  init_input_space("customers",function (data) {
    customers = data
  })

 // for send test data
  if ($('select.uuid').length) {
    init_input_space("devices",function (data) {
      var select = $("select.uuid")
      select.empty()
      select.append('<option value="" disabled selected>既存UUID</option>')
      devices = data
      for(var i in data){
        select.append('<option value="'+data[i].id+'">'
                      + data[i].uuid
                      + '</option>')
      }
    })
  }

  $('select.uuid').on('change',function () {
    var tmp_device = devices.filter(function (device) {
      return device.id == $('select.uuid').val()
    })[0]
    $('input.uuid').val(tmp_device.uuid)
  })

  // footer button listener
  $('.box-footer').on('click','button.clear',function () {
    clear_input_boxes()
  })
  $('.box-footer').on('click','.send_test',function () {
    var this_button = this
    //console.log(this_button);
    var url = "/api?uuid=" + $('input.uuid').val()
            + "&remain_lvl=" + $('select.remain_lvl').val()
            + "&battery_lvl=" + $('select.battery_lvl').val()
            + "&opened=" + $('select.opened').val()
    //console.log(url);
    if ($('input.uuid').val() && $('select.remain_lvl').val() && $('select.battery_lvl').val() && $('select.opened').val() ) {
      //console.log("send!!!");
      //$(this_button).html("送信中").addClass("disabled")
      $(this_button).html("送信中").toggleClass("disabled").prop("disabled", true);
      $.get(url,function (data,status) {

      }).done(function (data) {
        $(this_button).html("送信完成").addClass("btn-success").prop("disabled", true);
        console.log(data);
      }).fail(function (data,status) {
        console.log(data);
        //console.log(status);
        $(this_button).html("送信失敗").addClass("btn-danger").prop("disabled", true);
      }).always(function (data) {
        setTimeout(function () {
          $(this_button).html("送信")
          .removeClass("btn-success")
          .removeClass("btn-danger")
          .toggleClass("disabled").prop("disabled", false);
        }, 1500);
      })
    }else {
      alert("データ不完全！\n"+url)
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

function set_device_from_table(device) {
  //console.log(device.uuid);
  var tmp_customer = customers.filter(function (customer) {
    return customer.id == device.customer_id;
  })[0]
  /*
  var tmp_age_group = age_groups.filter(function (age_group) {
    return age_group.id == tmp_customer.age_group_id;
  })[0]*/
  //console.log(tmp_customer);
  $("input.uuid").val(device.uuid)
  $("select.battery_lvl").val(device.battery_lvl)
  $("select.device_statuses").val(device.device_status_id)
  $("select.device_statuses").val(device.device_status_id)
  $("input.item_code").val(device.item_code)
  $("select.items").val(device.item_id)
  $("select.ranks").val(device.rank_id)
  $("select.auto_order_triggers").val(device.individual_auto_order_trigger_id)
  $("select.follow_up_triggers").val(device.individual_follow_up_trigger_id)
  $("input.customer_name").val(device.name)
  $("input.mail").val(device.mail)
  $("select.age_groups").val(tmp_customer.age_group_id)
  $("input.zip_code").val(tmp_customer.zip_code)
  $("input.ruby").val(tmp_customer.ruby)
  $("select.sexes").val(tmp_customer.sex_id)
  $("input.address").val( tmp_customer.state
                        + tmp_customer.city
                        + tmp_customer.district
                        + tmp_customer.area)
}

function clear_input_boxes() {
  $(".box input").val("")
  $(".box select").val("")
}
