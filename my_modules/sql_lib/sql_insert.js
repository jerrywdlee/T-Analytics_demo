var SqlQueries = {

  admin_users : "INSERT INTO admin_users (email, name, password, auth_id) "
              + "VALUES ($1, $2, $3::text, $4::int)",

  auths       : "INSERT INTO auths (auth) VALUES ($1)",

  items       : "INSERT INTO items (item_code, item_name, info_url, purchase_url,"
              + "default_follow_up_trigger_id, default_auto_order_trigger_id) "
              + "VALUES ($1::text, $2, $3, $4 ,$5::int, $6::int)",

  recommend_usages : "INSERT INTO recommend_usages (item_id, "
                   + "open_per_morning, open_per_noon, open_per_night, open_per_day,"
                   + "if_slop, if_intercept, if_chi_test, if_welch_t_test ) "
                   + "VALUES ($1::int, $2::int, $3::int, $4::int, $5::int,"
                   + "$6::int, $7::int, $8::int, $9::int)",

  usages      : "INSERT INTO usages (device_id, "
              + "open_per_morning, open_per_noon, open_per_night, open_per_day"
              + "slop, intercept, chi_test, welch_t_test ) "
              + "VALUES ($1::int, $2, $3, $4, $5, $6::float, $7::float, $8::float, $9::float)",

  customers   : "INSERT INTO customers ( "
              + "name, ruby,sex_id, mail, birthday, age_group_id, tel,"
              + "zip_code, country, state, city, district, area,"
              + "location_lat, location_lng, tag ) VALUES"
              + "( $1, $2, $3::int,$4, $5::date,$6::int, $7::text,"
              + "$8::text, $9, $10, $11, $12,"
              + "$13, $14::float, $15::float, $16 )",

  sexes       : "INSERT INTO sexes ( sex ) VALUES ($1)",

  age_groups  : "INSERT INTO age_groups (age_group,upper_to,lower_to) VALUES ($1, $2, $3)",

  devices     : "INSERT INTO devices (uuid, item_id, customer_id, rank_id, device_status_id,"
              + "individual_follow_up_trigger_id, individual_auto_order_trigger_id )"
              + " VALUES ($1::text, $2::int, $3::int, $4::int, $5, $6::int, $7::int);",

  device_statuses : "INSERT INTO device_statuses (device_status) VALUES ($1)",

  follow_up_triggers    : "INSERT INTO follow_up_triggers (param_1, param_1_name, "
              + "condition, condition_name, param_2, param_2_name)"
              + "VALUES ($1, $2, $3 ,$4, $5, $6)",

  auto_order_triggers    : "INSERT INTO auto_order_triggers (param_1, param_1_name, "
              + "condition, condition_name, param_2, param_2_name)"
              + "VALUES ($1, $2, $3 ,$4, $5, $6)",


  ranks       : "INSERT INTO ranks (rank) VALUES ($1::text);",

  raw_datas   : "INSERT INTO raw_datas (uuid, remain_lvl, battery_lvl, opened) "
              + "VALUES ($1:text, $2::int, $3::int, $4::int)"

}

module.exports = SqlQueries;
