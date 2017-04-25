var pg_help = require(__dirname+'/postgres_help')
var fs = require('fs');
var config = {
  user: 't_analytics', //env var: PGUSER
  database: 't_analytics', //env var: PGDATABASE
  password: 'postgres', //env var: PGPASSWORD
  host: 'localhost',//default : 'localhost'
  port: 5432, //env var: PGPORT
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 3000, // how long a client is allowed to remain idle before being closed
};

pg_help.SetConnection(config)

var table_name = process.argv[2];
if (!table_name) {
  console.error("ERROR : NO PARAMETER!!");
  process.exit()
}

var sql_insert = require(__dirname+'/sql_lib/sql_insert');

var sql_select = require(__dirname+'/sql_lib/sql_select');

var params = require(__dirname+ '/dummy_data_jsons/'+ table_name +'.json');

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
  pg_help.BeginTransaction(sql_select.select(table_name),[],function (res) {
      console.log(res)
  })
}

pg_help.BeginTransaction(sql_insert[table_name], params_array, call_back)
