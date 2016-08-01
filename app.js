var express = require('express');
var breadcrumbs = require('express-breadcrumbs');

// database setting
var pg_help = require(__dirname+'/my_modules/postgres_help')
var pg_config = {
  user: 't_analytics', //env var: PGUSER
  database: 't_analytics', //env var: PGDATABASE
  password: 'postgres', //env var: PGPASSWORD
  host: 'localhost',//default : 'localhost'
  port: 5432, //env var: PGPORT
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};
pg_help.SetConnection(pg_config)
var sql_select = require(__dirname+'/my_modules/sql_lib/sql_select')
var sql_insert = require(__dirname+'/my_modules/sql_lib/sql_insert');

var app = express();
var port = 3033

var index_config = {
  user_name : 'Pirachu',
  user_auth : '管理者',
  user_icon_normal : 't_analytics/images/ware_chu.png',
  user_icon_small : 't_analytics/images/ware_chu_icon.png',
  user_company : 'TEMONA Inc.',
  homepage_name : 'ホーム',
  homepage_url : '/',
  search_box_placeholder : '商品・顧客',
  issuance_date : '1970-2016',
  right_holder : 'Jerry Lee',
  right_holder_url : 'https://www.facebook.com/jerrywdlee',
  system_version : '0.3.7'
}

//app.set('view engine', 'ejs');
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use(express.static('public'));
app.use(breadcrumbs.init());
// Set Breadcrumbs home information
app.use('/',breadcrumbs.setHome({
  name: index_config.homepage_name,
  url: index_config.homepage_url
}));

var server = require('http').createServer(app)
server.listen(process.env.PORT||port,function () {
  console.log('Listening on port %d', server.address().port);
})


//view系
app.get('/admin',function (req, res) {
  res.redirect('/dashboard');
})
app.get('/',function (req, res) {
  res.redirect('/user'+'?user_name=アイエフ');
})

app.get('/dashboard', function (req, res) {
  var page_title = 'ダッシュボード'
  req.breadcrumbs(page_title);
  res.render('index2', {
    page_class : 'admin',
    content_wrapper : 'content-wrapper',
    index_config,
    page_title : page_title,
    breadcrumbs: req.breadcrumbs()
    //server_url: server_url
 });
});

app.get('/user',function (req,res) {
  //console.log(req);
  //console.log(req.query);
  index_config.user_name = req.query.user_name? req.query.user_name:'コンパ'
  index_config.user_auth = 'ダイヤモンド会員'
  index_config.user_icon_normal = "t_analytics/images/"+"icon_compa.png"
  index_config.user_company = "COMPILER HEAT Inc."
  var page_title = index_config.user_name
  req.breadcrumbs(page_title);
  res.render('index2_customer', {
    page_class : 'customer',
    index_config,
    page_title : page_title,
    breadcrumbs: req.breadcrumbs()
    //server_url: server_url
 });
})

app.get('/device_manage', function (req, res) {
  var page_title = '端末管理'
  req.breadcrumbs(page_title);
  res.render('index2', {
    page_class : 'admin',
    content_wrapper : 'content-wrapper_device_config',
    index_config,
    page_title : page_title,
    breadcrumbs: req.breadcrumbs()
    //server_url: server_url
 });
});

app.get('/test_send', function (req, res) {
  var page_title = 'テストデータ送信'
  req.breadcrumbs(page_title);
  res.render('index2', {
    page_class : 'test',
    content_wrapper : 'content-wrapper_device_config',
    index_config,
    page_title : page_title,
    breadcrumbs: req.breadcrumbs()
    //server_url: server_url
 });
});

// Ajax系

app.get('/ajax/show_devices',function (req,res) {
  pg_help.BeginTransaction(sql_select.create_devices_table(),[],function (sql_res) {
    if(req.query.debug) console.log(sql_res);
    res.send(sql_res)
  })
})

app.get('/ajax/init_input',function (req,res) {
  //console.log(req.query.table_name);
  var table_name = req.query.table_name
  pg_help.BeginTransaction(sql_select.select(table_name),[],function (sql_res) {
      //console.log(sql_res)
      res.send(sql_res)
  })
})

app.get('/api',function (req,res) {
  //console.log(req.query);
  var datas_for_insert = [
    req.query.uuid,
    0,
    req.query.remain_lvl,
    req.query.battery_lvl,
    req.query.opened,
    JSON.stringify(req.query)
  ]
  //console.log(datas_for_insert);
  //console.log(sql_insert['raw_datas']);
  //BeginTransactionの引数２は二次元行列
  pg_help.BeginTransaction(sql_insert['raw_datas'],[datas_for_insert],function (insert_msg) {
    //console.log(insert_msg);
    res.send("OK")
    //pg_help.BeginTransaction(sql_select.select('raw_datas'),[],function (sql_res) {
        //console.log(sql_res)
        //res.send(sql_res)
    //})
  })
  //res.send(req.query)
})

app.get('/ajax/advanced_raw_datas',function (req,res) {
  pg_help.BeginTransaction(sql_select.advanced_raw_datas(),[],function (sql_res) {
    //console.log({data : sql_res})
    res.send({ data : sql_res })
  })
})
