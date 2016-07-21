var express = require('express');

var app = express();
var port = 3033

var index_config = {
  search_box_placeholder : '商品・顧客',
  issuance_date : '1970-2016',
  right_holder : 'Jerry Lee',
  right_holder_url : 'https://www.facebook.com/jerrywdlee',
  system_version : '0.1.6'
}

//app.set('view engine', 'ejs');
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
//app.use(express.static( __dirname + '/public'));
//app.use(express.static('public'));
//app.use("/public", express.static(__dirname + '/public'));
app.use(express.static('public'));
var server = require('http').createServer(app)
server.listen(process.env.PORT||port)

app.get('/', function (req, res) {
  res.render('index2', {
    index_config,
    page_title : 'T-Analytics Dashboard'
    //server_url: server_url
 });
});
