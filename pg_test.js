var pg = require('pg');

/*
//DBの準備
postgres=# create user t_analytics with password 'postgres';
postgres=# ALTER ROLE t_analytics WITH SUPERUSER CREATEDB CREATEROLE;
postgres=# create database t_analytics owner t_analytics;
*/

var conString = "postgres://t_analytics:postgres@localhost/t_analytics";
var resultName = "";
var client = new pg.Client(conString);
client.connect(function(err) {
    if(err) {
        return console.error('could not connect to postgres', err);
    }
    client.query("select * from age_groups where age_group = $1 and deleted <> true;",['50代'], function(err, result) {
        if(err) {
            return console.error('error running query', err);
        }
        //console.log(result);
        console.log(result.rows)
        //console.log(result.rows[0])
        //console.log(result.rows[0].name);
        //console.log(result.rows[1].name);
        //resultName = result.rows[0].name;
        client.end();
    });
});



function create_table_sql(table,var_clumns_str) {
  var init_sql = "CREATE TABLE "
               + table
               + "("
               + "id serial primary key,"
               + var_clumns_str
               + "created_at timestamp with time zone DEFAULT clock_timestamp(),"
               + "updated_at timestamp with time zone DEFAULT clock_timestamp(),"
               + "deleted int2 not null default 0"
               + ");";
  return init_sql;
}


/*
const create_admin_users = "CREATE TABLE "
                         + "admin_users "
                         + "("
                         + "id serial primary key,"
                         + "email text,"
                         + "name text,"
                         + "password text,"
                         + "auth_id int4,"
                         + "created_at timestamp with time zone DEFAULT clock_timestamp(),"
                         + "updated_at timestamp with time zone DEFAULT clock_timestamp(),"
                         + "deleted int2 not null default 0"
                         + ");"
*/
