var express = require('express');
var breadcrumbs = require('express-breadcrumbs');

var app = express();
var port = 3033

var index_config = {
  user_name : 'Pirachu',
  user_auth : '管理者',
  user_company : 'TEMONA Inc.',
  homepage_name : 'ホーム',
  homepage_url : '/',
  search_box_placeholder : '商品・顧客',
  issuance_date : '1970-2016',
  right_holder : 'Jerry Lee',
  right_holder_url : 'https://www.facebook.com/jerrywdlee',
  system_version : '0.1.8'
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
server.listen(process.env.PORT||port)

app.get('/',function (req, res) {
  res.redirect('dashboard');
})

app.get('/dashboard', function (req, res) {
  var page_title = 'ダッシュボード'
  req.breadcrumbs(page_title);
  res.render('index2', {
    index_config,
    page_title : page_title,
    breadcrumbs: req.breadcrumbs()
    //server_url: server_url
 });
});
