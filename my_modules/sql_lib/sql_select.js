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
