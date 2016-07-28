var pg_help = require('./postgres_help')
var fs = require('fs');
var config = {
  user: 't_analytics', //env var: PGUSER
  database: 't_analytics', //env var: PGDATABASE
  password: 'postgres', //env var: PGPASSWORD
  host: 'localhost',//default : 'localhost'
  port: 5432, //env var: PGPORT
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};

pg_help.SetConnection(config)

var sql = "INSERT INTO customers ( name, ruby, mail, birthday, age_group_id,"
          + "tel, zip_code, country, state, city, district, area,"
          + "location_lat, location_lng, tag ) VALUES"
          + "( $1, $2, $3, $4::date,$5::int, $6::text,"
          + "$7::text, $8, $9, $10, $11, $12,"
          + "$13::float, $14::float, $15 )"

var params = require('./create_dummy_customers.json');

var params_array = []
for (var i = 0; i < params.length; i++) {
  var temp_arry =[]
  for(var j in params[i]){
    temp_arry.push(params[i][j])
  }
  params_array.push(temp_arry)
}
console.log(params_array);

var call_back = function(res){
  console.log("DONE!!")
  pg_help.BeginTransaction("select * from customers",[],function (res) {
      console.log(res)
  })
}

pg_help.BeginTransaction(sql, params_array, call_back)
