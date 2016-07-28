var express = require('express');
var breadcrumbs = require('express-breadcrumbs');

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
  system_version : '0.2.7'
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
