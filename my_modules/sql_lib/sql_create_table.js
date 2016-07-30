var SqlQueries = {

  admin_users  :        " CREATE TABLE admin_users ( "
                      + " id serial primary key, "
                      + " email text not null UNIQUE, "
                      + " name text, "
                      + " password text, "
                      + " auth_id int4, "
                      + " created_at timestamp with time zone DEFAULT clock_timestamp(), "
                      + " updated_at timestamp with time zone DEFAULT clock_timestamp(), "
                      + " deleted bool not null default false); ",

  auths  :              " CREATE TABLE auths ( "
                      + " id serial primary key, "
                      + " auth text, "
                      + " created_at timestamp with time zone DEFAULT clock_timestamp(), "
                      + " updated_at timestamp with time zone DEFAULT clock_timestamp(), "
                      + " deleted bool not null default false); ",

  items  :              " CREATE TABLE items ( "
                      + " id serial primary key, "
                      + " item_code text not null, "
                      + " item_name text, "
                      + " info_url text, "
                      + " purchase_url text, "
                      + " default_follow_up_trigger_id int4, "
                      + " default_auto_order_trigger_id int4, "
                      + " created_at timestamp with time zone DEFAULT clock_timestamp(), "
                      + " updated_at timestamp with time zone DEFAULT clock_timestamp(), "
                      + " deleted bool not null default false); ",

  recommend_usages  :   " CREATE TABLE recommend_usages ( "
                      + " id serial primary key, "
                      + " item_id int4, "
                      + " open_per_morning float8 DEFAULT 0, "
                      + " open_per_noon float8 DEFAULT 0, "
                      + " open_per_night float8 DEFAULT 0, "
                      + " open_per_day float8 DEFAULT 0, "
                      + " if_slop int2, "
                      + " if_intercept int2, "
                      + " if_chi_test int2, "
                      + " if_welch_t_test int2, "
                      + " created_at timestamp with time zone DEFAULT clock_timestamp(), "
                      + " updated_at timestamp with time zone DEFAULT clock_timestamp(), "
                      + " deleted bool not null default false); ",

  usages  :           + " CREATE TABLE usages ( "
                      + " id serial primary key, "
                      + " device_id int4, "
                      + " open_per_morning float8 DEFAULT 0, "
                      + " open_per_noon float8 DEFAULT 0, "
                      + " open_per_night float8 DEFAULT 0, "
                      + " open_per_day float8 DEFAULT 0, "
                      + " slop float8, "
                      + " intercept float8, "
                      + " chi_test float8, "
                      + " welch_t_test float8, "
                      + " created_at timestamp with time zone DEFAULT clock_timestamp(), "
                      + " updated_at timestamp with time zone DEFAULT clock_timestamp(), "
                      + " deleted bool not null default false); ",

  customers  :         " CREATE TABLE customers ( "
                      +" id serial primary key, "
                      +" name text, "
                      +" ruby text, "
                      +" sex_id int4, "
                      +" mail text, "
                      +" birthday date, "
                      +" age_group_id int4, "
                      +" tel text, "
                      +" zip_code text, "
                      +" country text, "
                      +" state text,"
                      +" city text, "
                      +" district text, "
                      +" area text,  "
                      +" location_lat float8,"
                      +" location_lng float8, "
                      +" tag text, "
                      +" created_at timestamp with time zone DEFAULT clock_timestamp(), "
                      +" updated_at timestamp with time zone DEFAULT clock_timestamp(), "
                      +" deleted bool not null default false); ",


}

module.exports = SqlQueries;
