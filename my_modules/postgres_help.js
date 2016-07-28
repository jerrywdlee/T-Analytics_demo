var pg = require('pg');

var config = {
  user: 'postgres', //env var: PGUSER
  database: 'postgres', //env var: PGDATABASE
  password: 'postgres', //env var: PGPASSWORD
  host: 'localhost',//default : 'localhost'
  port: 5432, //env var: PGPORT
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};

//this initializes a connection pool
//it will keep idle connections open for a 30 seconds
//and set a limit of maximum 10 idle clients
var pool;
exports.SetConnection = function (new_config) {
  if(new_config){
    for (var key in new_config) {
      config[key] = new_config[key]
    }
  }
  pool = new pg.Pool(config);
}

exports.BeginTransaction =function (sql, params_array, call_back) {
  // to run a query we can acquire a client from the pool,
  // run a query on the client, and then return the client to the pool
  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }

    var pg_transaction = function (client, sql, params_array, call_back) {
      client.query('BEGIN', function(err, result) {
        console.log("BEGIN!!");
        if(err) return rollback(client, done, err);
        return sql_queries(client, done, sql, params_array, call_back);
      });
    }

    pg_transaction(client, sql, params_array, call_back)
    return false;
    //var sql = "select * from age_groups where age_group = $1 and deleted <> true;"
    //var params_array =[['50代'],['40代'],['30代'],['20代'],['10代']]
    /*
    sql_queries(client, done, sql, params_array, function (res) {
      console.log("ALL DONE!!")
      console.log(res);
    })
    */
    /*
    pg_transaction(client,sql,params_array,function (res) {
      console.log("ALL DONE!!")
      console.log(res);
    })
    */
  });

  pool.on('error', function (err, client) {
    console.error('idle client error', err.message, err.stack)
  })
}

var sql_queries = function (client, done, sql, params_array, call_back, i, results) {
  i = i == undefined ? 0:i;
  results = results == undefined ? [] : results;
  params_array = params_array.length? params_array : []
  //console.log(i+" : "+params_array[i]);
  client.query(sql, params_array[i], function (err,result) {
    if(err) return rollback(client,done,err);
    if(result) results=results.concat(result.rows)
    i++;
    if (i < params_array.length) {
      sql_queries(client, done, sql, params_array, call_back, i, results)
    } else {
      commit(client,done,results,call_back)
    }
  })
}

var rollback = function(client,done,err,results,call_back) {
  //terminating a client connection will
  //automatically rollback any uncommitted transactions
  //so while it's not technically mandatory to call
  //ROLLBACK it is cleaner and more correct
  client.query('ROLLBACK', function() {
    //client.end();
    console.log("ROLLBACK!!");
    console.error(err);
    if(call_back){
      call_back(results)
    }
    done();
    return false
  });
};

var commit = function (client,done,results,call_back) {
  client.query('COMMIT', function () {
    console.log("COMMIT!!");
    if(call_back){
      call_back(results);
    }
    done();
    return false;
  });
}
