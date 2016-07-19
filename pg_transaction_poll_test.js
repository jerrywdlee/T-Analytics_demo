var pg = require('pg');

var config = {
  user: 't_analytics', //env var: PGUSER
  database: 't_analytics', //env var: PGDATABASE
  password: 'postgres', //env var: PGPASSWORD
  host: 'localhost',//default : 'localhost'
  port: 5432, //env var: PGPORT
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};


//this initializes a connection pool
//it will keep idle connections open for a 30 seconds
//and set a limit of maximum 10 idle clients
var pool = new pg.Pool(config);

// to run a query we can acquire a client from the pool,
// run a query on the client, and then return the client to the pool
pool.connect(function(err, client, done) {
  if(err) {
    return console.error('error fetching client from pool', err);
  }
  var rollback = function(client,err) {
    //terminating a client connection will
    //automatically rollback any uncommitted transactions
    //so while it's not technically mandatory to call
    //ROLLBACK it is cleaner and more correct
    client.query('ROLLBACK', function() {
      //client.end();
      console.log("ROLLBACK!!");
      console.error(err);
      done();
    });
  };

  var transaction = function (client, sql, params, call_back) {
    client.query('BEGIN', function(err, result) {
      if(err) return rollback(client,err);
      client.query(sql, params, function(err, result) {
        if(err) return rollback(client,err);
          //disconnect after successful commit
        client.query('COMMIT', function () {
          //client.end.bind(client);
          call_back();
          done();
        });
      });
    });
  }

  transaction(client,
              "INSERT INTO admin_users(email, name, password, auth_id) VALUES ($1::text, $2::text, $3::text, $4::int)",
              ["lee@temona.co.jp","TEMONA-Lee","123456","1"],
              function() {console.log("Transaction OK!!")});
});



pool.on('error', function (err, client) {
  console.error('idle client error', err.message, err.stack)
})
