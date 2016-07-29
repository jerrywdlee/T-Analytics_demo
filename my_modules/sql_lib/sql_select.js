var create_sql = function (table_name, select_column_name , condition, limit, order_by, order) {
  select_column_name = select_column_name ? select_column_name.toString() : "*";
  condition = condition ? (" WHERE "+ condition ) : "";
  limit = limit? (" LIMIT "+limit) : "";
  order_by = order_by? (" ORDER BY "+order_by) : "";
  try {
    if (order_by == "" && order.toUpperCase()!="ASC" && order.toUpperCase()!="DESC") {
      order = "";
    } else {
      order = " "+order;
    }
  } catch (e) {
    order = "";
  }
  //console.log("SELECT "+ select_column_name +" FROM " + table_name + condition + limit + order_by + order);
  return "SELECT "+ select_column_name +" FROM " + table_name + condition + limit + order_by + order
}

exports.select_shown_data = function (table_name, select_column_name , condition, limit, order_by, order) {
  condition = condition ? (" WHERE ("+ condition + ") AND deleted <> true ") : "WHERE deleted <> true ";
  return create_sql(table_name, select_column_name , condition, limit, order_by, order)
}

exports.select = function (table_name, select_column_name , condition, limit, order_by, order) {
  return create_sql(table_name, select_column_name , condition, limit, order_by, order)
}

exports.create_devices_table = function () {
  sql =
        "SELECT dev.id, dev.uuid, item_id, item_code, item_name, customer_id, cu.name, cu.mail,"
      + "       rank_id, rank, device_status_id,device_status,rd.remain_lvl,rd.battery_lvl,rd.opened,"
      + "       individual_follow_up_trigger_id, individual_auto_order_trigger_id, "
      + "       ft.param_1 as ft_p1, ft.param_1_name as ft_p1n, ft.condition as ft_c, ft.condition_name as ft_cn, ft.param_2 as ft_p2, ft.param_2_name as ft_p2n,"
      + "       ot.param_1 as ot_p1, ot.param_1_name as ot_p1n, ot.condition as ot_c, ot.condition_name as ot_cn, ot.param_2 as ot_p2, ot.param_2_name as ot_p2n,"
      + "       location_lat, location_lng, dev.created_at, rd.updated_at "
      + "       from devices as dev "
      + "LEFT JOIN items as i ON item_id = i.id "
      + "LEFT JOIN customers as cu ON customer_id = cu.id "
      + "LEFT JOIN ranks as r on rank_id = r.id "
      + "LEFT JOIN device_statuses as ds on device_status_id = ds.id "
      + "LEFT JOIN (SELECT * FROM (SELECT id, uuid,device_id, remain_lvl, battery_lvl, opened, updated_at,"
      + "   row_number() over (partition by uuid order by updated_at DESC) as no "
      + "   FROM raw_datas) as raw WHERE no = 1) as rd  ON dev.uuid = rd.uuid "
      + "LEFT JOIN follow_up_triggers as ft on individual_follow_up_trigger_id = ft.id "
      + "LEFT JOIN auto_order_triggers as ot on individual_auto_order_trigger_id = ot.id "
      + "WHERE dev.deleted <> true and i.deleted <> true and cu.deleted <> true "
      + "      and r.deleted <> true and ds.deleted <> true and ft.deleted <> true and ot.deleted <> true "
      + "order by dev.updated_at desc;"
  //console.log(sql);
  return sql;
}
