var express = require('express');

var app = express();
var port = 3033

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
//app.use(express.static( __dirname + '/public'));
//app.use(express.static('public'));
//app.use("/public", express.static(__dirname + '/public'));
app.use(express.static('public'));
var server = require('http').createServer(app)
server.listen(process.env.PORT||port)

app.get('/', function (req, res) {
  res.render('index2', {
    //title: 'Express Sample',
    //server_url: server_url
 });
});
