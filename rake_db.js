var pg = require('pg');
var pg_help = require(__dirname+'/my_modules/postgres_help')

/*
//DBの準備
postgres=# create user t_analytics with password 'postgres';
postgres=# ALTER ROLE t_analytics WITH SUPERUSER CREATEDB CREATEROLE;
postgres=# create database t_analytics owner t_analytics;
*/

var pg_config = {
  user: 't_analytics', //env var: PGUSER
  database: 't_analytics', //env var: PGDATABASE
  //database : 'rake_test',
  password: 'postgres', //env var: PGPASSWORD
  host: 'localhost',//default : 'localhost'
  port: 5432, //env var: PGPORT
  max: 20, // max number of clients in the pool
  idleTimeoutMillis: 3000, // how long a client is allowed to remain idle before being closed
};

pg_help.SetConnection(pg_config)

var sql_create_table = require(__dirname+'/my_modules/sql_lib/sql_create_table');



// postgres://ユーザー:パスワード@IPアドレス:ポート番号/データベース

//var conString = "postgres://t_analytics:postgres@localhost/t_analytics";
//var conString = "postgres://t_analytics:postgres@localhost/rake_test";

for (var i in sql_create_table) {
  //console.log(i);
  pg_help.BeginTransaction(sql_create_table[i],[],(sql_res)=>{
    //console.log(sql_res);
  })
}

/*
pg_help.BeginTransaction(sql_create_table['items'],[],(sql_res)=>{
  console.log(sql_res);
})
pg_help.BeginTransaction(sql_create_table['ranks'],[],(sql_res)=>{
  console.log(sql_res);
})
pg_help.BeginTransaction(sql_create_table['raw_datas'],[],(sql_res)=>{
  console.log(sql_res);
})
console.log(sql_create_table['usages']);
pg_help.BeginTransaction(sql_create_table['usages'],[],(sql_res)=>{
  console.log(sql_res);
})*/
